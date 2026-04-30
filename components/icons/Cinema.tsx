function Cinema({ className }: { className?: string }) {
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
        d="M9.975 18.3334C14.5774 18.3334 18.3083 14.6024 18.3083 10C18.3083 5.39765 14.5774 1.66669 9.975 1.66669C5.37262 1.66669 1.64166 5.39765 1.64166 10C1.64166 14.6024 5.37262 18.3334 9.975 18.3334Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.28333 10.1917V8.80002C7.28333 7.06669 8.50833 6.35836 10.0083 7.22502L11.2167 7.92502L12.425 8.62502C13.925 9.49169 13.925 10.9084 12.425 11.775L11.2167 12.475L10.0083 13.175C8.50833 14.0417 7.28333 13.3334 7.28333 11.6V10.1917Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export default Cinema;
