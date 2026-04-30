import { PrimaryButton } from "./PrimaryButton";
import Translate from "./Translate";

interface RetryLoadingProps {
  retry: () => void;
}

function RetryLoading({ retry }: RetryLoadingProps) {
  return (
    <div className="flex justify-center">
      <PrimaryButton
        onClick={retry}
        size={"sm"}
        aria-label="Retry loading"
        className="text-xs px-3 y max-w-28 hover:bg-primary hover:text-primary-foreground transition-colors"
        variant={"outline"}
      >
        <Translate text="shared.retry" />
      </PrimaryButton>
    </div>
  );
}
export default RetryLoading;
