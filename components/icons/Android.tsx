import Image from "next/image";

function Android({ className }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center rounded-2xl  transition ${className}`}
    >
      <Image
        src="/media/icons/android.webp"
        alt="Android Icon"
        width={28}
        height={28}
        className="object-contain"
      />
    </div>
  );
}

export default Android;
