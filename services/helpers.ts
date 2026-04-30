import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { Language } from "@/types/shared";

type TokenSubscriber = (accessToken: string | null) => void;

class HttpHelpers {
  private apiBaseUrl?: string;
  private subscribers: TokenSubscriber[];
  public authenticatedAxios: AxiosInstance;
  public unAuthenticatedAxios: AxiosInstance;

  constructor() {
    this.subscribers = [];
    this.apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
    this.authenticatedAxios = axios.create({ baseURL: this.apiBaseUrl });
    this.unAuthenticatedAxios = axios.create({ baseURL: this.apiBaseUrl });

    this.addAuthenticationInterceptor();
    this.addUnauthenticationInterceptor();
  }

  getLocale(): Language {
    const stored = localStorage.getItem("locale") as Language | null;
    return stored || "en";
  }

  getToken(): string | null {
    const token = localStorage.getItem("token");
    return token;
  }

  onAccessTokenFetched(accessToken: string | null): void {
    this.subscribers.forEach((callback) => callback(accessToken));
    this.subscribers = [];
  }

  addSubscriber(callback: TokenSubscriber): void {
    this.subscribers.push(callback);
  }

  handleApplicationError<T = any>(
    response: AxiosResponse<T>
  ): Promise<AxiosResponse<T>> | AxiosResponse<T> {
    const data: any = response.data;

    if (data && typeof data === "object" && data.status === false) {
      const error: any = new Error(data.message || "Operation failed");
      error.response = {
        data: data,
        status: 200,
        statusText: "OK",
      };
      error.isApplicationError = true;
      return Promise.reject(error);
    }

    return response;
  }

  //  FIXED TYPE HERE
  async createRequestInterceptor(
    config: InternalAxiosRequestConfig,
    includeAuth = false
  ): Promise<InternalAxiosRequestConfig> {
    const locale = this.getLocale();
    config.headers = config.headers || {};

    config.headers["Accept-Language"] = locale;

    if (includeAuth) {
      const accessToken = this.getToken();
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }

    return config;
  }

  async handleAuthError(error: any): Promise<never> {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      this.onAccessTokenFetched(null);
      window.location.pathname = "/login";
    }

    return Promise.reject(error);
  }

  private addAuthenticationInterceptor(): void {
    this.authenticatedAxios.interceptors.request.use(
      async (config) => this.createRequestInterceptor(config, true),
      (error) => Promise.reject(error)
    );

    this.authenticatedAxios.interceptors.response.use(
      (response) => this.handleApplicationError(response),
      (error) => this.handleAuthError(error)
    );
  }

  private addUnauthenticationInterceptor(): void {
    this.unAuthenticatedAxios.interceptors.request.use(
      async (config) => this.createRequestInterceptor(config, false),
      (error) => Promise.reject(error)
    );

    this.unAuthenticatedAxios.interceptors.response.use(
      (response) => this.handleApplicationError(response),
      (error) => Promise.reject(error)
    );
  }
}

export default new HttpHelpers();
