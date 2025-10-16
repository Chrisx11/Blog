"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, ArrowRight } from "lucide-react"
import type { Devotional } from "@/lib/types"

interface DevotionalCardProps {
  devotional: Devotional
}

export function DevotionalCard({ devotional }: DevotionalCardProps) {
  const previewContent =
    devotional.content.length > 200 ? devotional.content.substring(0, 200) + "..." : devotional.content

  return (
    <Card
      id={`devotional-${devotional.id}`}
      className="overflow-hidden scroll-mt-24 shadow-feminine hover:shadow-feminine transition-all duration-500 hover-lift border-border/50 group"
    >
      <div className="relative h-64 md:h-80 w-full overflow-hidden">
        <Image
          src={devotional.imageUrl || "/placeholder.svg"}
          alt={devotional.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          priority={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      <CardContent className="p-6 md:p-8 bg-card/95 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Calendar className="h-4 w-4" />
          <time dateTime={devotional.date}>
            {new Date(devotional.date).toLocaleDateString("pt-BR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </time>
        </div>

        <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-4 text-balance group-hover:text-primary transition-colors duration-300">
          {devotional.title}
        </h2>

        {devotional.verse && (
          <blockquote className="border-l-4 border-primary pl-4 mb-6 italic text-muted-foreground bg-primary/5 py-3 rounded-r-md shadow-sm hover:shadow-md transition-shadow duration-300">
            {devotional.verse}
          </blockquote>
        )}

        <div className="prose prose-lg max-w-none mb-6 text-foreground leading-relaxed">
          <p className="mb-4 text-pretty">{previewContent}</p>
        </div>

        <Link href={`/devocional/${devotional.id}`}>
          <Button className="mb-6 w-full md:w-auto shadow-feminine hover:shadow-feminine transition-all duration-300 hover-lift gradient-primary text-primary-foreground hover:opacity-90">
            Continuar Lendo
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </Link>

        <div className="pt-6 border-t border-border/50">{/* ShareButtons component will remain here */}</div>
      </CardContent>
    </Card>
  )
}
