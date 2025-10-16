"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, ArrowRight } from "lucide-react"
import type { Devotional } from "@/lib/types"
import { AspectRatio } from "@/components/ui/aspect-ratio"

interface DevotionalCardProps {
  devotional: Devotional
}

export function DevotionalCard({ devotional }: DevotionalCardProps) {
  const previewContent =
    devotional.content.length > 200 ? devotional.content.substring(0, 200) + "..." : devotional.content

  return (
    <Card
      id={`devotional-${devotional.id}`}
      className="overflow-hidden scroll-mt-24 shadow-feminine hover:shadow-feminine transition-all duration-500 hover-lift border-border/50 group max-w-full flex flex-col h-full !py-0 !gap-0"
    >
      {/* Imagem */}
      <div className="relative w-full">
        <AspectRatio ratio={4/3} className="!w-full">
          <Image
            src={devotional.imageUrl || "/placeholder.svg"}
            alt={devotional.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110 rounded-b-none rounded-t-xl"
            priority={false}
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </AspectRatio>
      </div>
      {/* Conteúdo */}
      <CardContent className="flex-1 p-4 sm:p-6 md:p-6 bg-card/95 backdrop-blur-sm flex flex-col justify-between h-64 md:h-72">
        <div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">
            <Calendar className="h-4 w-4" />
            <time dateTime={devotional.date}>
              {new Date(devotional.date).toLocaleDateString("pt-BR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
          </div>
          <h2 className="text-lg sm:text-xl md:text-xl font-serif font-bold text-foreground mb-2 sm:mb-3 text-balance group-hover:text-primary transition-colors duration-300 line-clamp-2">
            {devotional.title}
          </h2>
          {devotional.verse && (
            <blockquote className="border-l-4 border-primary pl-3 sm:pl-4 mb-3 sm:mb-4 italic text-muted-foreground bg-primary/5 py-2 rounded-r-md shadow-sm hover:shadow-md transition-shadow duration-300 text-xs sm:text-sm line-clamp-2">
              {devotional.verse}
            </blockquote>
          )}
          <div className="prose prose-sm max-w-none mb-3 sm:mb-4 text-foreground leading-relaxed">
            <p className="mb-2 text-pretty line-clamp-3 text-sm">{previewContent}</p>
          </div>
        </div>
        <div className="mt-auto">
          <Link href={`/devocional/${devotional.id}`}>
            <Button className="mb-2 w-full shadow-feminine hover:shadow-feminine transition-all duration-300 hover-lift gradient-primary text-primary-foreground hover:opacity-90 text-sm">
              Continuar Lendo
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
