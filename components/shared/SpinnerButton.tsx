import React from "react";
import Translate from "./Translate";
import { Spinner } from "../ui/spinner";
import { Button } from "../custom/button";


export default function SpinnerButton({
  onClick,
  disabled,
  isSubmitting,
  className,
  type,
  isSubmittingText = "shared.sending",
  text = "",
}: {
  onClick?: () => void;
  disabled?: boolean ;
  isSubmitting?: boolean ;
  className?: string;
  type?: "button" | "submit" | "reset" | undefined;
  isSubmittingText: string;
  text: string;
}) {
  return (
    <Button onClick={onClick} disabled={disabled} className={className} type={type}>
      {isSubmitting ? (
        <div className="flex gap-2 justify-center items-center">
          <Spinner />
          <Translate text={isSubmittingText} />
        </div>
      ) : (
        <Translate text={text} />
      )}
    </Button>
  );
}
