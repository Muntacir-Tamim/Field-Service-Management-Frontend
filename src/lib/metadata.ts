import type { Metadata } from "next";
import { SITE } from "@/constants";

interface PageMetadataInput {
  title: string;
  description: string;
  path?: string;
  noIndex?: boolean;
}

export function createMetadata({
  title,
  description,
  path = "/",
  noIndex = false,
}: PageMetadataInput): Metadata {
  const fullTitle = `${title} | ${SITE.name}`;

  return {
    title: fullTitle,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url: path,
      siteName: SITE.fullName,
      type: "website",
      images: [{ url: "/fsm.jpg", alt: SITE.fullName }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: ["/fsm.jpg"],
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}
