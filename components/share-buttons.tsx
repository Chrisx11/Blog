"use client"

import { Button } from "@/components/ui/button"
import { Facebook, Instagram, MessageCircle } from "lucide-react"
import type { Devotional } from "@/lib/types"

interface ShareButtonsProps {
  devotional: Devotional
}

export function ShareButtons({ devotional }: ShareButtonsProps) {
  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}?devotional=${devotional.id}` : ""

  const shareText = `${devotional.title}\n\n${devotional.verse || ""}`

  const handleWhatsAppShare = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText + "\n\n" + shareUrl)}`
    window.open(url, "_blank")
  }

  const handleFacebookShare = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    window.open(url, "_blank", "width=600,height=400")
  }

  const handleInstagramShare = () => {
    // Instagram não permite compartilhamento direto via URL, então copiamos o texto
    navigator.clipboard.writeText(shareText + "\n\n" + shareUrl)
    alert("Texto copiado! Cole no Instagram para compartilhar.")
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium text-foreground">Compartilhar:</p>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={handleWhatsAppShare} className="gap-2 bg-transparent">
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </Button>

        <Button variant="outline" size="sm" onClick={handleFacebookShare} className="gap-2 bg-transparent">
          <Facebook className="h-4 w-4" />
          Facebook
        </Button>

        <Button variant="outline" size="sm" onClick={handleInstagramShare} className="gap-2 bg-transparent">
          <Instagram className="h-4 w-4" />
          Instagram
        </Button>
      </div>
    </div>
  )
}
