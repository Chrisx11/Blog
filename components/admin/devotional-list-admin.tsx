"use client"

import { Button } from "@/components/ui/button"
import { Calendar, Edit, Trash2 } from "lucide-react"
import type { Devotional } from "@/lib/types"
import Image from "next/image"

interface DevotionalListAdminProps {
  devotionals: Devotional[]
  onEdit: (devotional: Devotional) => void
  onDelete: (id: string) => void
}

export function DevotionalListAdmin({ devotionals, onEdit, onDelete }: DevotionalListAdminProps) {
  if (devotionals.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>Nenhum devocional encontrado.</p>
        <p className="text-sm mt-2">Clique em "Novo Devocional" para criar o primeiro.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {devotionals.map((devotional) => (
        <div
          key={devotional.id}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4 border border-border rounded-lg bg-card hover:bg-accent/50 transition-colors"
        >
          <div className="relative w-full sm:w-32 h-32 sm:h-24 flex-shrink-0 rounded overflow-hidden">
            <Image
              src={devotional.image_url || devotional.imageUrl || "/placeholder.svg"}
              alt={devotional.title}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground mb-1 sm:mb-2 text-sm sm:text-base line-clamp-2">{devotional.title}</h3>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-2">
              <Calendar className="h-3 w-3 flex-shrink-0" />
              <time dateTime={devotional.date}>{new Date(devotional.date).toLocaleDateString("pt-BR")}</time>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 sm:line-clamp-3">{devotional.content}</p>
          </div>

          <div className="flex flex-row sm:flex-col gap-2 sm:gap-2">
            <Button size="sm" variant="outline" onClick={() => onEdit(devotional)} className="gap-1 sm:gap-2 flex-1 sm:flex-none text-xs sm:text-sm">
              <Edit className="h-3 w-3" />
              <span className="sm:inline">Editar</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDelete(devotional.id)}
              className="gap-1 sm:gap-2 text-destructive hover:text-destructive flex-1 sm:flex-none text-xs sm:text-sm"
            >
              <Trash2 className="h-3 w-3" />
              <span className="sm:inline">Excluir</span>
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
