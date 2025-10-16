"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

export function DevotionalCarousel() {
  const [devotionals, setDevotionals] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchDevotionals() {
      setIsLoading(true)
      const { data, error } = await supabase
        .from("devotionals")
        .select("*")
        .order("date", { ascending: false })
      setDevotionals((data || []).map(d => ({ ...d, imageUrl: d.image_url ?? "" })))
      setCurrentIndex(0)
      setIsLoading(false)
    }
    fetchDevotionals()
  }, [])

  useEffect(() => {
    if (!isAutoPlaying || devotionals.length === 0) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % devotionals.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, devotionals.length])

  const goToPrevious = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev - 1 + devotionals.length) % devotionals.length)
  }

  const goToNext = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev + 1) % devotionals.length)
  }

  if (isLoading) {
    return <div className="relative w-full rounded-xl bg-card border shadow-2xl mb-12 h-[260px] md:h-[340px] flex items-center justify-center text-lg text-muted-foreground">Carregando devocionais...</div>
  }

  if (devotionals.length === 0) {
    return (
      <div className="relative w-full overflow-hidden rounded-xl bg-card border border-border/50 shadow-2xl mb-12 group flex items-center justify-center h-[280px] md:h-[350px]">
        <div className="text-center text-muted-foreground py-10">
          <img src="/placeholder.svg" alt="Nenhum devocional" className="mx-auto mb-4 w-16 h-16 opacity-50" />
          <h2 className="text-lg font-semibold">Nenhum devocional encontrado</h2>
          <p className="text-sm">Adicione devocionais para exibir aqui.</p>
        </div>
      </div>
    )
  }

  const currentDevotional = devotionals[currentIndex]

  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-card border border-border/50 shadow-2xl mb-12 group">
      <div className="relative h-[400px] md:h-[500px]">
        <img
          key={currentIndex}
          src={currentDevotional.imageUrl || "/placeholder.svg"}
          alt={currentDevotional.title}
          className="w-full h-full object-cover animate-in fade-in duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white backdrop-blur-sm bg-black/20">
          <p className="text-sm font-medium mb-3 opacity-90 tracking-wide uppercase">{currentDevotional.date}</p>
          <h2 className="text-2xl md:text-4xl font-serif font-bold mb-4 text-balance drop-shadow-lg animate-in slide-in-from-bottom-4 duration-700">
            {currentDevotional.title}
          </h2>
          <p className="text-sm md:text-base italic mb-6 line-clamp-2 text-pretty opacity-95 animate-in slide-in-from-bottom-4 duration-700 delay-100">
            {currentDevotional.verse}
          </p>
          <Link href={`/devocional/${currentDevotional.id}`}>
            <Button
              variant="secondary"
              size="sm"
              className="shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 backdrop-blur-md bg-white/90 hover:bg-white animate-in slide-in-from-bottom-4 duration-700 delay-200"
            >
              Ler Devocional
            </Button>
          </Link>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white backdrop-blur-md shadow-xl border border-white/20 transition-all duration-300 hover:scale-110"
        onClick={goToPrevious}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white backdrop-blur-md shadow-xl border border-white/20 transition-all duration-300 hover:scale-110"
        onClick={goToNext}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {devotionals.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index)
              setIsAutoPlaying(false)
            }}
            className={`h-2 rounded-full transition-all duration-500 shadow-lg ${
              index === currentIndex ? "bg-white w-8 shadow-white/50" : "bg-white/50 w-2 hover:bg-white/70 hover:w-4"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
