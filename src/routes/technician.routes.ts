import {
  BarChart3,
  Bell,
  CalendarClock,
  FileText,
  LayoutDashboard,
  MessageSquare,
  Sparkles,
  UserCircle,
} from "lucide-react";
import type { SidebarItems } from "@/types";

export const TECHNICIAN_ROUTES = {
  root: "/technician",
  assignments: "/technician/assignments",
  workOrders: "/technician/work-orders",
  skills: "/technician/skills",
  performance: "/technician/performance",
  feedbacks: "/technician/feedbacks",
  notifications: "/technician/notifications",
  profile: "/technician/profile",
} as const;

export const technicianMenu: SidebarItems = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        url: TECHNICIAN_ROUTES.root,
        icon: LayoutDashboard,
        exact: true,
      },
    ],
  },
  {
    title: "My Work",
    items: [
      {
        title: "Assignments",
        url: TECHNICIAN_ROUTES.assignments,
        icon: CalendarClock,
      },
      {
        title: "Work Orders",
        url: TECHNICIAN_ROUTES.workOrders,
        icon: FileText,
      },
      { title: "Skills", url: TECHNICIAN_ROUTES.skills, icon: Sparkles },
      {
        title: "Performance",
        url: TECHNICIAN_ROUTES.performance,
        icon: BarChart3,
      },
      {
        title: "Feedbacks",
        url: TECHNICIAN_ROUTES.feedbacks,
        icon: MessageSquare,
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        title: "Notifications",
        url: TECHNICIAN_ROUTES.notifications,
        icon: Bell,
      },
      { title: "Profile", url: TECHNICIAN_ROUTES.profile, icon: UserCircle },
    ],
  },
];
