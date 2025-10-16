"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { ThemeToggle } from "@/components/theme-toggle"

interface HeaderProps {
  onSearch?: (query: string) => void
}

export function Header({ onSearch }: HeaderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated")
    setIsAuthenticated(authStatus === "true")
  }, [])

  return (
    <header className="border-b border-border bg-card/95 backdrop-blur-sm sticky top-0 z-50 shadow-feminine">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="text-3xl font-bold text-foreground whitespace-nowrap hover-lift bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            <span style={{fontFamily: 'var(--font-dancing-script), "Dancing Script", cursive'}}>Meu Lugar com </span>
            <span style={{fontFamily: 'var(--font-inter), "Inter", sans-serif', fontStyle: 'italic'}}>ELE</span>
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href={isAuthenticated ? "/admin" : "/admin/login"}>
              <Button variant="ghost" size="sm" className="whitespace-nowrap hover-lift gradient-primary text-primary-foreground hover:shadow-feminine">
                Admin
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
