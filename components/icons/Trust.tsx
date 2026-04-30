import React from "react";

function Trust({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={31}
      height={31}
      viewBox="0 0 31 31"
      fill="none"
       className={className}
    >
      <path
        d="M13.2731 2.82165L6.95919 5.20043C5.50408 5.74451 4.3147 7.46532 4.3147 9.009V18.4102C4.3147 19.9033 5.30164 21.8645 6.50368 22.7629L11.9445 26.8245C13.7286 28.1657 16.6641 28.1657 18.4482 26.8245L23.889 22.7629C25.091 21.8645 26.078 19.9033 26.078 18.4102V9.009C26.078 7.45267 24.8886 5.73185 23.4335 5.18777L17.1196 2.82165C16.0441 2.4294 14.3233 2.4294 13.2731 2.82165Z"
        stroke="currentColor"
        strokeWidth="1.89796"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.4509 15.0192L13.4881 17.0563L18.9289 11.6155"
        stroke="currentColor"
        strokeWidth="1.89796"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default Trust;
