import Logo from "@/components/shared/Logo";
import LangSwitcher from "../components/shared/LangSwitcher";

function MinimalLayoutHeader() {
  return (
    <header className="flex md:justify-center p-5">
      <Logo />
      <div className="absolute top-10 end-5 lg:end-40">
        <LangSwitcher />
      </div>
    </header>
  );
}

export default MinimalLayoutHeader;
