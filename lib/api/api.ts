import { type ApiResponse } from "@/types/apiResponse";
import { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { notify } from "../notify";

// ------------------ Types ------------------
export interface ApiValidationErrors {
  [key: string]: string[];
}

export interface ApiErrorResponse {
  response?: {
    status?: number;
    data?: {
      message?: string;
      errors?: ApiValidationErrors;
      exception?: string;
      file?: string;
      line?: number;
      trace?: unknown[];
    };
  };
  message?: string;
}

export interface ApiRequestOptions<
  T = unknown,
  M = Record<string, unknown>,
  TFieldValues extends FieldValues = FieldValues
> {
  setError?: UseFormSetError<TFieldValues>;
  setLoading?: (loading: boolean) => void;
  setOpen?: (open: boolean) => void;
  onSuccess?: (response: ApiResponse<T, M>) => void;
  onValidationError?: (
    errors: ApiValidationErrors,
    setError?: UseFormSetError<TFieldValues>,
    error?: ApiErrorResponse
  ) => void;
  onError?: (err: ApiErrorResponse) => void;
  t?: (key: string) => string;
  showErrorToast?: boolean;
}

// ------------------ Helper ------------------
export const setServerErrors = <TFieldValues extends FieldValues>(
  errorResponse: unknown,
  setError: UseFormSetError<TFieldValues>,
  showToast = true
): boolean => {
  const possibleError = errorResponse as Partial<{
    message: string;
    errors: ApiValidationErrors;
  }>;

  const responseErrors =
    possibleError.errors && typeof possibleError.errors === "object"
      ? possibleError.errors
      : (errorResponse as ApiValidationErrors | undefined);

  const message = possibleError.message;

  if (
    responseErrors &&
    typeof responseErrors === "object" &&
    !Array.isArray(responseErrors)
  ) {
    let hasFieldErrors = false;

    Object.entries(responseErrors).forEach(([field, messages]) => {
      if (Array.isArray(messages) && messages.length > 0) {
        setError(field as Path<TFieldValues>, {
          type: "server",
          message: messages[0],
        });
        hasFieldErrors = true;
      }
    });

    if (hasFieldErrors) return true;
  }

  if (message && showToast) {
    notify(message, { type: "error" });
    return false;
  }

  return false;
};

// ------------------ Main apiRequest ------------------
export const apiRequest = async <
  T = unknown,
  M = Record<string, unknown>,
  TFieldValues extends FieldValues = FieldValues
>(
  promise: Promise<ApiResponse<T, M>>,
  {
    setError,
    setLoading,
    setOpen,
    onSuccess,
    onValidationError,
    onError,
    t,
    showErrorToast = true,
  }: ApiRequestOptions<T, M, TFieldValues> = {}
): Promise<ApiResponse<T, M>> => {
  if (setLoading) setLoading(true);

  try {
    const res = await promise;

    if (setLoading) setLoading(false);

    if (res?.data || res.status === "OK") {
      if (onSuccess) {
        onSuccess(res);
      }

      setOpen?.(false);

      return res;
    } else {
      // Handle responses without data (but still successful)
      const errorMessage =
        res?.message || t?.("shared.error") || "Something went wrong";

      if (showErrorToast) {
        notify(errorMessage, { type: "error" });
      }

      if (onError) {
        onError({ message: errorMessage });
      }

      return {
        success: false,
        message: errorMessage,
      } as ApiResponse<T, M>;
    }
  } catch (error: unknown) {
    if (setLoading) setLoading(false);

    const err = error as ApiErrorResponse;
    const status = err?.response?.status;
    const data = err?.response?.data;

    //  Log errors in development only
    if (process.env.NODE_ENV === "development") {
      console.log("❌ API Request Error:", {
        status,
        message: data?.message,
        errors: data?.errors,
        fullError: err,
      });
    }

    //  Handle validation errors (422) - Show field errors via setError
    if (status === 422) {
      const validationErrors = data?.errors || {};

      if (onValidationError) {
        onValidationError(validationErrors, setError, err);
      } else if (setError) {
        //  Only notify for server errors (not field validation errors)
        setServerErrors(validationErrors, setError, false);
      }

      return {
        success: false,
        errors: validationErrors,
        message: data?.message,
      } as ApiResponse<T, M>;
    }

    //  Handle all other errors (500, 404, 401, network, etc.)
    const errorMessage =
      data?.message ||
      err?.message ||
      t?.("validation.toastError") ||
      "Something went wrong";

    //  Only show toast for server errors
    if (showErrorToast) {
      notify(errorMessage, { type: "error" });
    }

    if (onError) {
      onError(err);
    }

    //  NEVER throw - always return safe response
    return {
      success: false,
      message: errorMessage,
      data: undefined,
    } as ApiResponse<T, M>;
  }
};
