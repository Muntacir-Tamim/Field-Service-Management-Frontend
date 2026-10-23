import { MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";
import Link from "next/link";
import Logo from "@/assets/svg/Logo";
import { NAV_LINKS, SITE } from "@/constants";

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr_1.4fr]">
        <div className="space-y-3">
          <Link href="/" className="flex items-center gap-2">
            {/* <Logo /> */}
            <span className="font-heading text-lg font-semibold">
              {SITE.name}
            </span>
          </Link>
          <p className="max-w-xs text-sm text-muted-foreground">
            {SITE.tagline}
          </p>
        </div>

        <nav aria-label="Footer" className="space-y-3">
          <h2 className="text-sm font-semibold">Explore</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-foreground">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold">Get started</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/register" className="hover:text-foreground">
                Create an account
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-foreground">
                Log in
              </Link>
            </li>
            <li>
              <Link href="/apply" className="hover:text-foreground">
                Become a technician
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold">Contact</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <MailIcon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <a
                href={`mailto:${SITE.email}`}
                className="hover:text-foreground"
              >
                {SITE.email}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <PhoneIcon
                className="mt-0.5 size-4 shrink-0"
                aria-hidden="true"
              />
              <a
                href={`tel:${SITE.phone.replace(/[^+\d]/g, "")}`}
                className="hover:text-foreground"
              >
                {SITE.phone}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPinIcon
                className="mt-0.5 size-4 shrink-0"
                aria-hidden="true"
              />
              {SITE.address}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t">
        <p className="mx-auto w-full max-w-6xl px-4 py-4 text-xs text-muted-foreground sm:px-6">
          © {new Date().getFullYear()} {SITE.fullName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
