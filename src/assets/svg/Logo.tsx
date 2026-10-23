import Image from "next/image";

export default function Logo({ size = 70 }: { size?: number }) {
  return (
    <Image
      src="/logo.png"
      alt="FSM logo"
      width={size}
      height={size}
      className="object-contain"
      priority
    />
  );
}
