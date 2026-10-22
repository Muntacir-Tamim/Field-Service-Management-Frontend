"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/assets/svg/Logo";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { getDashboardPath } from "@/lib/auth-redirect";
import { getMenuByRole } from "@/routes";
import type { SidebarItem, UserRole } from "@/types";
import { humanizeEnum } from "@/utils";

function isItemActive(pathname: string, item: SidebarItem) {
  if (item.exact) {
    return pathname === item.url;
  }
  return pathname === item.url || pathname.startsWith(`${item.url}/`);
}

export function DashboardSidebar({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  const menu = getMenuByRole(role);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip="FSM"
              render={<Link href={getDashboardPath(role)} />}
            >
              <span className="flex size-8 shrink-0 items-center justify-center [&_svg]:size-7">
                <Logo />
              </span>
              <span className="grid flex-1 text-left leading-tight">
                <span className="truncate text-sm font-semibold">FSM</span>
                <span className="truncate text-xs text-muted-foreground">
                  {humanizeEnum(role)} panel
                </span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {menu.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={isItemActive(pathname, item)}
                      render={
                        <Link
                          href={item.url}
                          onClick={() => setOpenMobile(false)}
                        />
                      }
                    >
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
