import type { UserRole } from "@/types";

export interface DemoAccount {
  role: UserRole;
  label: string;
  description: string;
  email: string;
  password: string;
}

/**
 * Demo credentials for one-click login. These users must exist in the backend
 * (seed them there). Override per environment via NEXT_PUBLIC_DEMO_* variables.
 */
export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    role: "ADMIN",
    label: "Admin",
    description: "Manage requests, technicians & invoices",
    email: process.env.NEXT_PUBLIC_DEMO_ADMIN_EMAIL ?? "admin@demo.com",
    password: process.env.NEXT_PUBLIC_DEMO_ADMIN_PASSWORD ?? "Demo@1234",
  },
  {
    role: "CUSTOMER",
    label: "Customer",
    description: "Book services & pay with bKash",
    email: process.env.NEXT_PUBLIC_DEMO_CUSTOMER_EMAIL ?? "customer@demo.com",
    password: process.env.NEXT_PUBLIC_DEMO_CUSTOMER_PASSWORD ?? "Demo@1234",
  },
  {
    role: "TECHNICIAN",
    label: "Technician",
    description: "Handle assignments & work orders",
    email:
      process.env.NEXT_PUBLIC_DEMO_TECHNICIAN_EMAIL ?? "technician@demo.com",
    password: process.env.NEXT_PUBLIC_DEMO_TECHNICIAN_PASSWORD ?? "Demo@1234",
  },
];
