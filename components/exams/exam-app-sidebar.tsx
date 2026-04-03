"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  FileQuestion,
  BookOpen,
  BarChart3,
  ClipboardList,
  RotateCcw,
  Command,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const examNavItems = [
  { title: "Home", url: "", icon: Home },
  { title: "New Questions", url: "questions", icon: FileQuestion },
  { title: "Study", url: "study", icon: BookOpen },
  { title: "Stats", url: "stats", icon: BarChart3 },
  { title: "Exams", url: "self-assessments", icon: ClipboardList },
  { title: "Review", url: "review", icon: RotateCcw },
] as const;

export function ExamAppSidebar({
  slug,
  examName,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  slug: string;
  examName: string;
}) {
  const pathname = usePathname();
  const basePath = `/exams/${slug}`;
  const { user } = useUser();
  const navUser = {
    name: user?.fullName ?? user?.username ?? "User",
    email: user?.primaryEmailAddress?.emailAddress ?? "",
    avatar: user?.imageUrl ?? "",
  };

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={
                <Link href={basePath}>
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <Command className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{examName}</span>
                    <span className="truncate text-xs">DrNote</span>
                  </div>
                </Link>
              }
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <div data-slot="sidebar-group" data-sidebar="group" className="relative flex w-full min-w-0 flex-col p-2">
          <div className="flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70">
            Navigate
          </div>
          <ul data-slot="sidebar-menu" data-sidebar="menu" className="flex w-full min-w-0 flex-col gap-1">
            {examNavItems.map((item) => {
              const href = item.url ? `${basePath}/${item.url}` : basePath;
              const isActive =
                (item.url === "" && pathname === basePath) ||
                (item.url !== "" && (pathname === href || pathname.startsWith(href + "/")));
              const Icon = item.icon;
              return (
                <li key={item.url || "home"} data-slot="sidebar-menu-item" data-sidebar="menu-item" className="group/menu-item relative">
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={isActive}
                    className={cn(
                      "rounded-lg",
                      /* Chatbase-style: white pill + hairline on gray rail */
                      isActive &&
                        "!bg-white !text-zinc-900 shadow-[0_0_0_1px_rgba(24,24,27,0.08)] hover:!bg-white dark:!bg-zinc-800 dark:!text-zinc-50 dark:shadow-[0_0_0_1px_rgba(255,255,255,0.1)] dark:hover:!bg-zinc-800"
                    )}
                    render={
                      <Link href={href}>
                        <Icon className="size-4" />
                        <span>{item.title}</span>
                      </Link>
                    }
                  />
                </li>
              );
            })}
          </ul>
        </div>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={navUser} />
      </SidebarFooter>
    </Sidebar>
  );
}
