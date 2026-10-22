"use client";

import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Logo from "@/assets/svg/Logo";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { NAV_LINKS, SITE } from "@/constants";
import { useGetMe } from "@/hooks";
import { getDashboardPath } from "@/lib/auth-redirect";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

// public site এর উপরের bar। logged-in থাকলে Login এর জায়গায় "Dashboard"
export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { data } = useGetMe();
  const user = data?.data;

  const authLinks = user ? (
    <Link
      href={getDashboardPath(user.role)}
      className={cn(buttonVariants())}
      onClick={() => setOpen(false)}
    >
      Dashboard
    </Link>
  ) : (
    <>
      <Link
        href="/login"
        className={cn(buttonVariants({ variant: "ghost" }))}
        onClick={() => setOpen(false)}
      >
        Log in
      </Link>
      <Link
        href="/register"
        className={cn(buttonVariants())}
        onClick={() => setOpen(false)}
      >
        Get started
      </Link>
    </>
  );

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-medium">
          <Logo />
          <span className="font-heading text-lg font-semibold">
            {SITE.name}
          </span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(pathname, link.href) ? "page" : undefined}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                isActive(pathname, link.href) && "bg-muted text-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {user ? null : (
            <Link
              href="/apply"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              Become a technician
            </Link>
          )}
          {authLinks}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
        >
          <MenuIcon />
        </Button>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-72">
          <SheetHeader>
            <SheetTitle>{SITE.fullName}</SheetTitle>
            <SheetDescription>{SITE.tagline}</SheetDescription>
          </SheetHeader>
          <nav aria-label="Mobile" className="flex flex-col gap-1 px-4 pb-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground",
                  isActive(pathname, link.href) && "bg-muted text-foreground",
                )}
              >
                {link.label}
              </Link>
            ))}
            {user ? null : (
              <Link
                href="/apply"
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                Become a technician
              </Link>
            )}
            <div className="mt-3 flex flex-col gap-2 [&>a]:w-full">
              {authLinks}
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}
