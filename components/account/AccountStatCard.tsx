import { fade } from "@/lib/animation";
import Animate from "../animation/Animate";

function AccountStatCard({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <Animate variants={fade} className="bg-background rounded-2xl p-4 flex items-start gap-3 border border-foreground/5">
      <div className="w-9 h-9 rounded-xl bg-primary/5 flex items-center justify-center text-primary shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-xl font-bold leading-tight">{value}</p>
        <p className="text-xs text-foreground/50 mt-0.5">{label}</p>
      </div>
    </Animate>
  );
}

export default AccountStatCard