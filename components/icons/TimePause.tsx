function TimePause({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      className={className}
    >
      <path
        d="M9.99967 18.3333C5.97467 18.3333 2.70801 15.0667 2.70801 11.0417C2.70801 7.01667 5.97467 3.75 9.99967 3.75C14.0247 3.75 17.2913 7.01667 17.2913 11.0417"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 6.66667V10.8333"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 1.66667H12.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.833 14.1667V17.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.333 14.1667V17.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export default TimePause;
