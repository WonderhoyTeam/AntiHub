"use client"

import * as React from "react"
import {
  IconChartBar,
  IconDashboard,
  IconHelp,
  IconListDetails,
  IconSettings,
  IconDeviceImacCode
} from "@tabler/icons-react"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { getStoredUser } from "@/lib/api"
import { useTranslation } from "@/lib/i18n/hooks"
import { LanguageSwitcher } from "@/components/language-switcher"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { t } = useTranslation()
  const [user, setUser] = React.useState({
    name: t('user.guest'),
    email: t('user.notLoggedIn'),
    avatar: "/logo_light.png",
  })

  const navMain = [
    {
      title: t('nav.dashboard'),
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: t('nav.accounts'),
      url: "/dashboard/accounts",
      icon: IconListDetails,
    },
    {
      title: t('nav.analytics'),
      url: "/dashboard/analytics",
      icon: IconChartBar,
    },
    {
      title: t('nav.playground'),
      url: "/dashboard/playground",
      icon: IconDeviceImacCode,
    }
  ]

  const navSecondary = [
    {
      title: t('nav.settings'),
      url: "/dashboard/settings",
      icon: IconSettings,
    },
    {
      title: t('nav.help'),
      url: "/dashboard/help",
      icon: IconHelp,
    },
  ]

  React.useEffect(() => {
    const storedUser = getStoredUser()
    if (storedUser) {
      setUser({
        name: storedUser.username,
        email: storedUser.username,
        avatar: storedUser.avatar_url || "/logo_light.png",
      })
    }
  }, [])

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/dashboard" className="flex items-center gap-2">
                <img
                  src="/logo_light.png"
                  alt="AntiHub Logo"
                  className="h-5 w-5"
                />
                <span className="text-base font-semibold">AntiHub</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <div className="p-2">
          <LanguageSwitcher />
        </div>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
