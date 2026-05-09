const OrderHeading = ({
  label,
  headingPrefix,
  headingHighlight,
  subheading,
}: {
  label: string;
  headingPrefix: string;
  headingHighlight: string;
  subheading: string;
}) => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        <span className="text-[10px] uppercase tracking-[0.2em] text-foreground/40">
          {label}
        </span>
      </div>

      <h1 className="text-4xl font-bold text-foreground leading-none tracking-tight">
      {headingPrefix}{" "}
        <span className="text-primary">
         {headingHighlight}
        </span>
      </h1>

      <p className="text-foreground/35 text-sm mt-2.5 max-w-md">
       {subheading}
      </p>
    </div>
  );
};

export default OrderHeading;
