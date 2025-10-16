"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { DevotionalManager } from "@/components/admin/devotional-manager"
import { BibleSearch } from "@/components/admin/bible-search"
import { supabase } from "@/lib/utils"
import {
  SidebarProvider, Sidebar, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton,
  SidebarInset, SidebarTrigger, SidebarHeader, SidebarGroup, SidebarGroupLabel, SidebarFooter, SidebarSeparator
} from "@/components/ui/sidebar"
import { FileText, PlusCircle, BookOpen, LogOut, ArrowLeft } from "lucide-react"

export default function AdminPanel() {
  const router = useRouter()
  const params = useSearchParams()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  // menu: "list" (default), "new" (criar novo) ou "bible" (bíblia)
  const [menu, setMenu] = useState(params.get("create") === "1" ? "new" : params.get("bible") === "1" ? "bible" : "list")

  useEffect(() => {
    if (params.get("create") === "1") setMenu("new")
    else if (params.get("bible") === "1") setMenu("bible")
    else setMenu("list")
  }, [params])

  useEffect(() => {
    async function checkAuth() {
      const { data } = await supabase.auth.getUser()
      if (data.user) {
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
        router.push("/admin/login")
      }
      setIsLoading(false)
    }
    checkAuth()
  }, [router])

  const handleMenuChange = (key: "list" | "new" | "bible") => {
    setMenu(key)
    if (key === "new") router.replace("/admin?create=1")
    else if (key === "bible") router.replace("/admin?bible=1")
    else router.replace("/admin")
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const handleBackToBlog = () => {
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-muted/30 flex w-full">
        <Sidebar collapsible="offcanvas" className="bg-gradient-to-b from-card to-card/80 border-r border-border/50 shadow-lg">
          <SidebarHeader className="p-3 sm:p-4">
            <SidebarGroup>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-primary-foreground font-bold text-sm sm:text-base">A</span>
                </div>
                <SidebarGroupLabel className="text-base sm:text-lg font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Admin</SidebarGroupLabel>
              </div>
            </SidebarGroup>
          </SidebarHeader>
          
          <SidebarContent className="px-2">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 mb-3">
                Gerenciamento
              </SidebarGroupLabel>
              <SidebarMenu className="space-y-2">
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={menu === "list"}
                    onClick={() => handleMenuChange("list")}
                    aria-current={menu === "list"}
                    className="rounded-xl hover:bg-accent/80 transition-all duration-300 h-12 px-4 shadow-sm hover:shadow-md"
                  >
                    <FileText className="mr-3 h-5 w-5" /> 
                    <span className="font-medium">Devocionais</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={menu === "new"}
                    onClick={() => handleMenuChange("new")}
                    aria-current={menu === "new"}
                    className="rounded-xl hover:bg-accent/80 transition-all duration-300 h-12 px-4 shadow-sm hover:shadow-md"
                  >
                    <PlusCircle className="mr-3 h-5 w-5" /> 
                    <span className="font-medium">Novo Devocional</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>

            <SidebarSeparator className="my-4" />

            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 mb-3">
                Ferramentas
              </SidebarGroupLabel>
              <SidebarMenu className="space-y-2">
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={menu === "bible"}
                    onClick={() => handleMenuChange("bible")}
                    aria-current={menu === "bible"}
                    className="rounded-xl hover:bg-accent/80 transition-all duration-300 h-12 px-4 shadow-sm hover:shadow-md"
                  >
                    <BookOpen className="mr-3 h-5 w-5" /> 
                    <span className="font-medium">Bíblia</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="p-2">
            <SidebarSeparator className="mb-4" />
            <SidebarMenu className="space-y-2">
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleBackToBlog}
                  className="rounded-xl hover:bg-accent/80 transition-all duration-300 h-12 px-4 text-muted-foreground hover:text-foreground shadow-sm hover:shadow-md"
                >
                  <ArrowLeft className="mr-3 h-5 w-5" /> 
                  <span className="font-medium">Voltar ao Blog</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleLogout}
                  className="rounded-xl hover:bg-destructive/10 hover:text-destructive transition-all duration-300 h-12 px-4 text-muted-foreground shadow-sm hover:shadow-md"
                >
                  <LogOut className="mr-3 h-5 w-5" /> 
                  <span className="font-medium">Sair</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="flex flex-col min-h-screen w-full" style={{ width: '100%', maxWidth: 'none', flex: '1 1 0%' }}>
          {/* Header responsivo */}
          <div className="sticky top-0 z-30 bg-card/95 backdrop-blur-sm border-b border-border h-14 sm:h-16 shadow-sm w-full" style={{ width: '100%', maxWidth: 'none' }}>
            <div className="flex items-center px-3 sm:px-4 h-full w-full">
              <SidebarTrigger className="mr-2 h-8 w-8 sm:h-9 sm:w-9 rounded-lg hover:bg-accent/80 transition-colors" />
              <span className="text-lg sm:text-xl font-script font-bold text-foreground ml-1 sm:ml-2 tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Admin</span>
              <div className="flex-1" />
              {/* Botões de ação no header para mobile */}
              <div className="flex items-center gap-1 sm:hidden">
                <button
                  onClick={handleBackToBlog}
                  className="p-2 rounded-lg hover:bg-accent/80 transition-colors shadow-sm"
                  title="Voltar ao Blog"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors shadow-sm"
                  title="Sair"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          
          <main className="flex-1 px-3 py-4 sm:px-4 sm:py-6 md:px-6 lg:px-8 w-full">
            <div className="w-full max-w-none">
              <div className="mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1 sm:mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Painel Administrativo</h1>
                <p className="text-sm sm:text-base text-muted-foreground">Gerencie os devocionais do seu blog</p>
              </div>
              {menu === "bible" ? (
                <BibleSearch />
              ) : (
                <DevotionalManager
                  overrideMode={menu}
                  setOverrideMode={handleMenuChange}
                />
              )}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
