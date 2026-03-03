'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { LogOut, Users, FileText, ClipboardList } from "lucide-react"
import { logoutAction } from "@/lib/actions-auth"
import Link from "next/link"
import { usePathname } from "next/navigation"

function NavLink({ href, children, icon: Icon }: { href: string; children: React.ReactNode; icon: React.ComponentType<{ className?: string }> }) {
  const pathname = usePathname()
  const isActive = pathname === href || (href !== "/admin" && pathname.startsWith(href))

  return (
    <SidebarMenuButton
      asChild
      isActive={isActive}
    >
      <Link href={href}>
        <Icon className="size-4" />
        <span>{children}</span>
      </Link>
    </SidebarMenuButton>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar>
        <SidebarHeader className="flex items-center justify-center h-16 border-b border-sidebar-border">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Buku Tamu Admin
          </h1>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <NavLink href="/admin/daftar-tamu" icon={Users}>
                    Daftar Tamu
                  </NavLink>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <NavLink href="/admin/daftar-pengunjung" icon={ClipboardList}>
                    Daftar Pengunjung
                  </NavLink>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <NavLink href="/admin/laporan" icon={FileText}>
                    Laporan
                  </NavLink>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarSeparator />
        <SidebarFooter>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={() => {
                      logoutAction()
                    }}
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive/80"
                  >
                    <LogOut className="size-4" />
                    <span>Keluar</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="bg-slate-50">
        <div className="p-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
