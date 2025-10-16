"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "@/components/admin/image-upload"
import type { Devotional } from "@/lib/types"

interface DevotionalFormProps {
  devotional?: Devotional
  onSubmit: (devotional: Omit<Devotional, "id">) => void
  onCancel: () => void
}

export function DevotionalForm({ devotional, onSubmit, onCancel }: DevotionalFormProps) {
  const [formData, setFormData] = useState({
    title: devotional?.title || "",
    verse: devotional?.verse || "",
    content: devotional?.content || "",
    image_url: devotional?.imageUrl || devotional?.image_url || "",
    date: devotional?.date || new Date().toISOString().split("T")[0],
    author: devotional?.author || "Admin",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 bg-card p-4 sm:p-6 rounded-xl shadow-lg border border-border/50">
      <div className="space-y-2">
        <Label htmlFor="title">Título *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Digite o título do devocional"
          required
          className="shadow-sm text-sm sm:text-base rounded-lg"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="verse">Versículo</Label>
        <Input
          id="verse"
          value={formData.verse}
          onChange={(e) => handleChange("verse", e.target.value)}
          placeholder="Ex: João 3:16"
          className="shadow-sm text-sm sm:text-base rounded-lg"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Conteúdo *</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => handleChange("content", e.target.value)}
          placeholder="Digite o conteúdo do devocional (use duas quebras de linha para separar parágrafos)"
          rows={8}
          required
          className="shadow-sm text-sm sm:text-base resize-none rounded-lg"
        />
      </div>

      <ImageUpload value={formData.image_url} onChange={(value) => handleChange("image_url", value)} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Data *</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => handleChange("date", e.target.value)}
            required
            className="shadow-sm text-sm sm:text-base rounded-lg"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="author">Autor</Label>
          <Input
            id="author"
            value={formData.author}
            onChange={(e) => handleChange("author", e.target.value)}
            placeholder="Nome do autor"
            className="shadow-sm text-sm sm:text-base rounded-lg"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button type="submit" className="flex-1 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-sm sm:text-base rounded-lg">
          {devotional ? "Atualizar" : "Criar"} Devocional
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1 bg-transparent shadow-md hover:shadow-lg transition-all duration-300 text-sm sm:text-base rounded-lg"
        >
          Cancelar
        </Button>
      </div>
    </form>
  )
}
