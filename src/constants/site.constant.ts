export const SITE = {
  name: "FSM",
  fullName: "Field Service Management",
  tagline: "Book trusted technicians and track every job in one place.",
  email: "support@example.com",
  phone: "+880 1700-000000",
  address: "Dhaka, Bangladesh",
  hours: "Sat – Thu, 9:00 AM – 6:00 PM",
} as const;

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About us", href: "/about-us" },
  { label: "Contact", href: "/contact-us" },
] as const;

export const HOW_IT_WORKS = [
  {
    title: "Submit a request",
    description:
      "Describe the problem, add photos and choose a preferred date. It takes a couple of minutes.",
  },
  {
    title: "We review and assign",
    description:
      "Our team reviews your request and assigns a verified technician with the right skills.",
  },
  {
    title: "Technician does the job",
    description:
      "Follow the visit live: on the way, arrived, in progress and completed, with a service report.",
  },
  {
    title: "Pay securely and rate",
    description:
      "Pay the invoice with bKash and tell us how it went to help keep quality high.",
  },
] as const;
