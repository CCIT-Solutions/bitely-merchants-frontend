import Heading from "./Heading";

const OrderHeading = ({
  label,
title,
  subheading,
}: {
  label: string;
  title: string;
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

      <Heading title= {title} className="sm:text-4xl text-start leading-none tracking-tight"/>

      <p className="text-foreground/35 text-sm mt-2.5 max-w-3xl">
       {subheading}
      </p>
    </div>
  );
};

export default OrderHeading;
