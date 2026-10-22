import Link from "next/link";
import type { ReactNode } from "react";
import Logo from "@/assets/svg/Logo";

export default function AuthSplitLayout({
  children,
  image = "/login.jpg",
}: {
  children: ReactNode;
  image?: string;
}) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <Logo />
            <span>FSM</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">{children}</div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        {/* biome-ignore lint/performance/noImgElement: static decorative image */}
        <img
          src={image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
