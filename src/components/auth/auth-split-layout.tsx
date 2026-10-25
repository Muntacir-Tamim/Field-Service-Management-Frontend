import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import Logo from "@/assets/svg/Logo";

export default function AuthSplitLayout({
  children,
  image = "/fsm.jpg",
}: {
  children: ReactNode;
  image?: string;
}) {
  return (
    <div className="grid min-h-svh lg:h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-2 p-4 md:p-6 lg:overflow-y-auto">
        <div className="flex justify-center gap-2 md:justify-start">
          {/* <Link href="/" aria-label="Home" className="flex items-center">
            <Logo size={44} />
          </Link> */}
        </div>
        <div className="flex flex-1 items-center justify-center py-2">
          <div className="w-full max-w-xs">{children}</div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <Image
          src={image}
          alt=""
          fill
          priority
          sizes="50vw"
          className="object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
