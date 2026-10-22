import {
  Bell,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  MessageSquare,
  UserCircle,
} from "lucide-react";
import type { SidebarItems } from "@/types";

export const CUSTOMER_ROUTES = {
  root: "/dashboard",
  serviceRequests: "/dashboard/service-requests",
  newServiceRequest: "/dashboard/service-requests/new",
  payments: "/dashboard/payments",
  feedbacks: "/dashboard/feedbacks",
  notifications: "/dashboard/notifications",
  profile: "/dashboard/profile",
} as const;

export const customerMenu: SidebarItems = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        url: CUSTOMER_ROUTES.root,
        icon: LayoutDashboard,
        exact: true,
      },
    ],
  },
  {
    title: "Services",
    items: [
      {
        title: "Service Requests",
        url: CUSTOMER_ROUTES.serviceRequests,
        icon: ClipboardList,
      },
      { title: "Payments", url: CUSTOMER_ROUTES.payments, icon: CreditCard },
      {
        title: "Feedbacks",
        url: CUSTOMER_ROUTES.feedbacks,
        icon: MessageSquare,
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        title: "Notifications",
        url: CUSTOMER_ROUTES.notifications,
        icon: Bell,
      },
      { title: "Profile", url: CUSTOMER_ROUTES.profile, icon: UserCircle },
    ],
  },
];
