
export const MacroBar = ({
  protein,
  carbs,
  fat,
  isPercent,
}: {
  protein: number;
  carbs: number;
  fat: number;
  isPercent?: boolean;
}) => {
  const total = protein + carbs + fat;
  const pPct = Math.round((protein / total) * 100);
  const cPct = Math.round((carbs / total) * 100);
  const fPct = 100 - pPct - cPct;
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex w-full h-1.5 gap-0.5 rounded-full overflow-hidden">
        <div
          className="bg-[#987dde] rounded-l-full"
          style={{ width: `${pPct}%` }}
        />
        <div className="bg-[#f4b248]" style={{ width: `${cPct}%` }} />
        <div
          className="bg-[#64acec] rounded-r-full"
          style={{ width: `${fPct}%` }}
        />
      </div>
      <div className="flex justify-between w-full">
        <span className="text-[10px] text-[#343b42]">
          {isPercent ? `${protein}%` : `${protein}g`} Protein
        </span>
        <span className="text-[10px] text-[#343b42]">
          {isPercent ? `${carbs}%` : `${carbs}g`} Carbs
        </span>
        <span className="text-[10px] text-[#343b42]">
          {isPercent ? `${fat}%` : `${fat}g`} Fat
        </span>
      </div>
    </div>
  );
};

export default MacroBar