
function PlanUsageRing({ value, max, label }: { value: number; max: number; label: string }) {
  const pct = (value / max) * 100;
  const r = 28;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  const isMax = value === max;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative size-18">
        <svg viewBox="0 0 72 72" className="w-full h-full -rotate-90">
          <circle cx="36" cy="36" r={r} fill="none" stroke="#F3F4F6" strokeWidth="5" />
          <circle
            cx="36" cy="36" r={r} fill="none"
            stroke={isMax ? "#6ef843" : "#6ef843"}
            strokeWidth="5" strokeLinecap="round"
            strokeDasharray={`${dash} ${circ}`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center gap-.5 justify-center font-bold">
          <span className="text-sm text-foreground/90 leading-none">{value}</span>
          <span className="text-[10px] text-green-600">/ {max}</span>
        </div>
      </div>
      <p className="text-xs text-neutral-500 text-center font-medium">{label}</p>
    </div>
  );
}

export default PlanUsageRing