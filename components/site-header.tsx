'use client';

import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"
import { useTranslation } from "@/lib/i18n/hooks"

export function SiteHeader() {
  const pathname = usePathname()
  const { t } = useTranslation()

  // 页面标题映射
  const PAGE_TITLES: Record<string, string> = {
    '/dashboard': t('nav.dashboard'),
    '/dashboard/accounts': t('nav.accounts'),
    '/dashboard/analytics': t('nav.analytics'),
    '/dashboard/settings': t('nav.settings'),
    '/dashboard/profile': t('nav.profile'),
    '/dashboard/help': t('nav.help'),
    '/dashboard/playground': t('nav.playground'),
  }

  const title = PAGE_TITLES[pathname] || t('nav.dashboard')

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{title}</h1>
        <div className="ml-auto flex items-center gap-2">
          <AnimatedThemeToggler />
        </div>
      </div>
    </header>
  )
}
