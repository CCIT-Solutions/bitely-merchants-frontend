import Translate from "./Translate";

function ErrorMessage() {
  return (
    <div className="text-red-500 text-center py-4 text-sm" role="alert">
      <Translate text="shared.somethingwrong" />
    </div>
  );
}
export default ErrorMessage;
