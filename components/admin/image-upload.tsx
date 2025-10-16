"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X, ImageIcon, Link2 } from "lucide-react"
import Image from "next/image"
import { uploadImageToSupabase } from "@/lib/utils";

interface ImageUploadProps {
  value: string
  onChange: (value: string) => void
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [uploadMode, setUploadMode] = useState<"url" | "file">("url")
  const [preview, setPreview] = useState<string>(value)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith("image/")) {
        alert("Por favor, selecione apenas arquivos de imagem")
        return
      }
      // Validar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("A imagem deve ter no máximo 5MB")
        return
      }
      setUploading(true)
      try {
        // Por enquanto, vamos usar uma URL temporária base64
        const reader = new FileReader()
        reader.onload = (e) => {
          const result = e.target?.result as string
          setPreview(result)
          onChange(result)
          setUploading(false)
        }
        reader.readAsDataURL(file)
      } catch (e) {
        console.error("Erro detalhado:", e);
        alert(`Erro ao processar a imagem: ${e instanceof Error ? e.message : 'Erro desconhecido'}`)
        setUploading(false)
      }
    }
  }

  const handleUrlChange = (url: string) => {
    setPreview(url)
    onChange(url)
  }

  const clearImage = () => {
    setPreview("")
    onChange("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <Button
          type="button"
          variant={uploadMode === "url" ? "default" : "outline"}
          size="sm"
          onClick={() => setUploadMode("url")}
          className="flex-1 text-xs sm:text-sm h-10 sm:h-9"
        >
          <Link2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">URL da Imagem</span>
          <span className="sm:hidden">URL</span>
        </Button>
        <Button
          type="button"
          variant={uploadMode === "file" ? "default" : "outline"}
          size="sm"
          onClick={() => setUploadMode("file")}
          className="flex-1 text-xs sm:text-sm h-10 sm:h-9"
        >
          <Upload className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Upload de Arquivo</span>
          <span className="sm:hidden">Upload</span>
        </Button>
      </div>

      {uploadMode === "url" ? (
        <div className="space-y-2">
          <Label htmlFor="imageUrl">URL da Imagem *</Label>
          <Input
            id="imageUrl"
            value={value}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="/peaceful-landscape.png"
            required
            className="text-sm rounded-lg"
          />
          <p className="text-sm text-muted-foreground">
            Use /placeholder.svg?height=400&width=800&query=sua descrição para gerar imagens
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="imageFile">Carregar Imagem *</Label>
          <div
            className="border-2 border-dashed border-border rounded-lg p-4 sm:p-8 text-center hover:border-primary transition-colors cursor-pointer bg-muted/20"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              id="imageFile"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <Upload className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-2 sm:mb-4 text-muted-foreground" />
            <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">Clique para selecionar uma imagem</p>
            <p className="text-xs text-muted-foreground">PNG, JPG, WEBP até 5MB</p>
            {uploading && <p className="text-sm text-primary mt-2">Processando imagem...</p>}
          </div>
        </div>
      )}

      {preview && (
        <div className="relative rounded-lg overflow-hidden border border-border shadow-lg group">
          <div className="relative h-48 w-full">
            <Image src={preview || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            onClick={clearImage}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <ImageIcon className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      )}
    </div>
  )
}
