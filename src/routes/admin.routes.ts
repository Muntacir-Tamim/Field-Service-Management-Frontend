import {
  BarChart3,
  Bell,
  CalendarClock,
  ClipboardList,
  FileText,
  LayoutDashboard,
  MessageSquare,
  ReceiptText,
  ScrollText,
  Sparkles,
  UserCircle,
  Users,
  Wrench,
} from "lucide-react";
import type { SidebarItems } from "@/types";

export const ADMIN_ROUTES = {
  root: "/admin",
  serviceRequests: "/admin/service-requests",
  assignments: "/admin/assignments",
  workOrders: "/admin/work-orders",
  technicians: "/admin/technicians",
  technicianPerformance: "/admin/technician-performance",
  invoices: "/admin/invoices",
  feedbacks: "/admin/feedbacks",
  skills: "/admin/skills",
  users: "/admin/users",
  auditLogs: "/admin/audit-logs",
  notifications: "/admin/notifications",
  profile: "/admin/profile",
} as const;

export const adminMenu: SidebarItems = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        url: ADMIN_ROUTES.root,
        icon: LayoutDashboard,
        exact: true,
      },
    ],
  },
  {
    title: "Operations",
    items: [
      {
        title: "Service Requests",
        url: ADMIN_ROUTES.serviceRequests,
        icon: ClipboardList,
      },
      {
        title: "Assignments",
        url: ADMIN_ROUTES.assignments,
        icon: CalendarClock,
      },
      { title: "Work Orders", url: ADMIN_ROUTES.workOrders, icon: FileText },
      { title: "Invoices", url: ADMIN_ROUTES.invoices, icon: ReceiptText },
    ],
  },
  {
    title: "People",
    items: [
      { title: "Technicians", url: ADMIN_ROUTES.technicians, icon: Wrench },
      {
        title: "Performance",
        url: ADMIN_ROUTES.technicianPerformance,
        icon: BarChart3,
      },
      { title: "Skills", url: ADMIN_ROUTES.skills, icon: Sparkles },
      { title: "Users", url: ADMIN_ROUTES.users, icon: Users },
      { title: "Feedbacks", url: ADMIN_ROUTES.feedbacks, icon: MessageSquare },
    ],
  },
  {
    title: "System",
    items: [
      { title: "Audit Logs", url: ADMIN_ROUTES.auditLogs, icon: ScrollText },
      { title: "Notifications", url: ADMIN_ROUTES.notifications, icon: Bell },
      { title: "Profile", url: ADMIN_ROUTES.profile, icon: UserCircle },
    ],
  },
];
