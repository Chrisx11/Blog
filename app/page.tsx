"use client"

import { useState } from "react"
import { DevotionalList } from "@/components/devotional-list"
import { Header } from "@/components/header"
import { DevotionalCarousel } from "@/components/devotional-carousel"

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={setSearchQuery} />
      <main className="container mx-auto px-2 sm:px-4 py-8 sm:py-12 max-w-md sm:max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4 text-balance leading-tight">
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Devocionais Diários</span>
          </h1>
          <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">Mensagens de fé e inspiração para cada dia, criadas com amor e carinho</p>
        </div>

        <DevotionalCarousel />

        <DevotionalList searchQuery={searchQuery} />
      </main>
    </div>
  )
}
