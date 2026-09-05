"use client";

import { BotIcon, StarIcon, VideoIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { DashboardUserButton } from "./dashboard-user-button";
import { DashboardTrial } from "./dashboard-trial";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";

// ✅ Navigation sections
const firstSection = [
  {
    icon: VideoIcon,
    label: "Meetings",
    href: "/meetings",
  },
  {
    icon: BotIcon,
    label: "Agents",
    href: "/agents",
  },
];

const secondSection = [
  {
    icon: StarIcon,
    label: "Upgrade",
    href: "/upgrade",
  },
];

export const DashboardSidebar = () => {
  const pathname = usePathname();

  return (
    <Sidebar>
      {/* Logo */}
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2 px-2 pt-2">
          <Image src="/logo.svg" height={36} width={36} alt="MEETINGLY" />
          <p className="text-2xl font-semibold text-white">MEETINGLY</p>
        </Link>
      </SidebarHeader>

      {/* Separator */}
      <div className="px-4 py-2">
        <Separator className="opacity-10 bg-[#5D6B68]" />
      </div>

      {/* Navigation */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {firstSection.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        "h-10 flex items-center gap-2 px-3 rounded-md transition-colors border border-transparent",
                        // Hover state → teal gradient
                        "hover:bg-gradient-to-r hover:from-teal-700 hover:to-teal-900 hover:text-white",
                        // Active state → solid/gradient teal
                        isActive &&
                          "bg-gradient-to-r from-teal-800 to-teal-900 text-white border-teal-700/30",
                      )}
                      isActive={pathname === item.href}
                    >
                      <Link href={item.href}>
                        <item.icon className="w-4 h-4" />
                        <span className="text-sm font-medium tracking-tight">
                          {item.label}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Separator */}
        <div className="px-4 py-2">
          <Separator className="opacity-10 bg-[#5D6B68]" />
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondSection.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        "h-10 flex items-center gap-2 px-3 rounded-md transition-colors border border-transparent",
                        // Hover state → teal gradient
                        "hover:bg-gradient-to-r hover:from-teal-700 hover:to-teal-900 hover:text-white",
                        // Active state → solid/gradient teal
                        isActive &&
                          "bg-gradient-to-r from-teal-800 to-teal-900 text-white border-teal-700/30",
                      )}
                      isActive={pathname === item.href}
                    >
                      <Link href={item.href}>
                        <item.icon className="w-4 h-4" />
                        <span className="text-sm font-medium tracking-tight">
                          {item.label}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="text-white">
        <DashboardTrial />
        <DashboardUserButton />
      </SidebarFooter>
    </Sidebar>
  );
};
