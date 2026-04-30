import React from "react";
import Translate from "@/components/shared/Translate";
import { useLang } from "@/hooks/useLang";

interface TermsAprovalProps {
  onPayNow: () => void;
  isProcessing?: boolean;
}

export const TermsAproval: React.FC<TermsAprovalProps> = ({
  onPayNow,
  isProcessing = false,
}) => {
  const { t } = useLang();

  return (
    <div className="mb-8">
   
      <div className="bg-neutral-950 rounded-lg py-4">
        <p className="text-sm text-neutral-400 leading-relaxed mb-4">
          <Translate
            text="checkout.termsNotice"
            components={{
              payNow: (
                <span
                  className="font-semibold text-white hover:underline"
                >
                  "{t("checkout.payNow")}"
                </span>
              ),
              terms: (
                <a
                  href="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-white hover:underline"
                >
                  {t("checkout.terms")}
                </a>
              ),
              privacy: (
                <a
                  href="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-white hover:underline"
                >
                  {t("checkout.privacy")}
                </a>
              ),
              shareInfo: (
                <a
                  href="/data-sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-white hover:underline"
                >
                  {t("checkout.infoShare")}
                </a>
              ),
            }}
          />
        </p>

        <button
          onClick={onPayNow}
          disabled={ isProcessing}
          className="w-full bg-primary text-black font-semibold py-4 px-6 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isProcessing ? t("checkout.processing") || "Processing..." : t("checkout.payNow")}
        </button>
      </div>
    </div>
  );
};

export default TermsAproval;