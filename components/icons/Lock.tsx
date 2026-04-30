function Lock({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M16.4709 9.40335V7.25435C16.4399 4.73535 14.3719 2.71935 11.8539 2.75035C9.38691 2.78135 7.39191 4.76735 7.34991 7.23435V9.40335"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.9103 14.1562V16.3772"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.9103 8.82422C6.16531 8.82422 4.25031 10.3922 4.25031 15.0952C4.25031 19.7992 6.16531 21.3672 11.9103 21.3672C17.6553 21.3672 19.5713 19.7992 19.5713 15.0952C19.5713 10.3922 17.6553 8.82422 11.9103 8.82422Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default Lock;
