import type { Metadata } from "next";
import { SITE } from "@/constants";

interface PageMetadataInput {
  title: string;
  description: string;
  path?: string;
  /** Keep auth / utility pages out of search results. */
  noIndex?: boolean;
}

/** One place that builds title, description, Open Graph and Twitter tags. */
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
