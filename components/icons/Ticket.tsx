function Ticket({ className }: { className?: string }) {
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
        d="M19.5 12.2807C19.5 10.9249 20.62 9.82455 22 9.82455V8.84209C22 4.91227 21 3.92981 17 3.92981H7C3 3.92981 2 4.91227 2 8.84209V9.33332C3.38 9.33332 4.5 10.4337 4.5 11.7895C4.5 13.1452 3.38 14.2456 2 14.2456V14.7368C2 18.6667 3 19.6491 7 19.6491H17C21 19.6491 22 18.6667 22 14.7368C20.62 14.7368 19.5 13.6365 19.5 12.2807Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 3.92981L10 19.6491"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="5 5"
      />
    </svg>
  );
}
export default Ticket;
