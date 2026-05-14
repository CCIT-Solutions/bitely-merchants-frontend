import { useLang } from "@/hooks/useLang";
import { FaCheck } from "react-icons/fa6";


function Stepper({currentIndex}: {currentIndex: number}) {
  const steps = ["plan", "checkout", "confirm"];
  const {t} = useLang()
  return (
    <div className="flex items-center gap-3 flex-wrap mb-8">
      {steps.map((s, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        return (
          <div key={s} className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all duration-300
                  ${done ? "bg-foreground text-background border-foreground" : active ? "bg-primary text-primary-foreground border-primary" : "border-border dark:border-primary-foreground text-muted-foreground dark:bg-primary-foreground/50"}`}
              >
                {done ? <FaCheck size={10} strokeWidth={3} /> : i + 1}
              </div>
              <span
                className={`text-[10px] tracking-widest uppercase 
                  ${done || active ? "text-foreground" : "text-muted-foreground"}`}
              >
                {t(`steppers.${s}`)}
              </span>
            </div>
          {i < steps.length - 1 && (
              <div className="w-8 h-px bg-border " />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default Stepper