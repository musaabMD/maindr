"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { SupportSideSheet } from "@/components/support-side-sheet"
import { LifeBuoyIcon, SparklesIcon } from "lucide-react"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const [supportOpen, setSupportOpen] = useState(false)
  const { isMobile, state } = useSidebar()

  return (
    <>
      <div
        className="flex min-w-0 flex-col gap-1"
        data-slot="nav-user-footer"
      >
        <SidebarMenu className="gap-0">
          <SidebarMenuItem>
            <Tooltip>
              <TooltipTrigger
                className="peer/menu-button group/menu-button flex w-full min-w-0 cursor-default items-center gap-2 overflow-hidden rounded-lg px-2 py-2 text-left text-sm text-sidebar-foreground outline-none ring-sidebar-ring transition-colors group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:rounded-md group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:justify-center hover:bg-sidebar-accent/70 focus-visible:ring-2"
                data-slot="sidebar-menu-button"
                data-sidebar="menu-button"
              >
                <Avatar className="size-8 shrink-0 rounded-md group-data-[collapsible=icon]:size-7">
                  <AvatarImage src={user.avatar} alt="" />
                  <AvatarFallback className="rounded-md text-xs font-medium">
                    {user.name
                      .split(/\s+/)
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid min-w-0 flex-1 gap-0.5 text-left leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-medium tracking-tight">
                    {user.name}
                  </span>
                  {user.email ? (
                    <span className="truncate text-[11px] text-sidebar-foreground/60">
                      {user.email}
                    </span>
                  ) : (
                    <span className="truncate text-[11px] text-sidebar-foreground/45">
                      Signed in
                    </span>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                align="center"
                hidden={state !== "collapsed" || isMobile}
                className="max-w-xs"
              >
                <p className="font-medium">{user.name}</p>
                {user.email ? (
                  <p className="text-muted-foreground text-xs">{user.email}</p>
                ) : (
                  <p className="text-muted-foreground text-xs">Signed in</p>
                )}
              </TooltipContent>
            </Tooltip>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarMenu className="gap-0">
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Support"
              onClick={() => setSupportOpen(true)}
              className="h-8 cursor-pointer rounded-lg group-data-[collapsible=icon]:rounded-md"
            >
              <LifeBuoyIcon className="size-4" />
              <span>Support</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Upgrade to Pro"
              className="h-8 rounded-lg group-data-[collapsible=icon]:rounded-md"
              render={
                <Link href="/upgrade">
                  <SparklesIcon className="size-4 shrink-0" />
                  <span className="truncate">Upgrade to Pro</span>
                </Link>
              }
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </div>

      <SupportSideSheet open={supportOpen} onOpenChange={setSupportOpen} />
    </>
  )
}
