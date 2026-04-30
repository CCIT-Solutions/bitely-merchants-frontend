
import Translate from "./Translate";
import AppLayout from "@/layout/AppLayout";
import Image from "next/image";

const NoInternet = () => {
    return (
    <AppLayout>
      <div
        className={
          " h-[750px] flex flex-col gap-0 items-center justify-center"
        }
      >
        <Image src="/media/images/no-internet.png" alt="No Internet Connection" height={180} width={200}/>
        <div className="flex flex-col justify-center items-center gap-1 p-5 text-center">
          <p className="text font-bold">
            <Translate text="noInternet.noInternet" />
          </p>
          <p className="text-neutral-500 text-sm">
            <Translate text="noInternet.check" />
          </p>
        </div>
      </div>
    </AppLayout>
  );
};
export default NoInternet;
