"use client"

import { Button } from "@/components/ui/button"
import { Facebook, Instagram, MessageCircle } from "lucide-react"
import type { Devotional } from "@/lib/types"

interface ShareButtonsProps {
  devotional: Devotional
}

export function ShareButtons({ devotional }: ShareButtonsProps) {
  const preview = (devotional.content || "").replace(/\s+/g, " ").slice(0, 140) + (devotional.content.length > 140 ? "..." : "");
  const link = typeof window !== "undefined"
    ? `${window.location.origin}/devocional/${devotional.id}`
    : `/devocional/${devotional.id}`;
  const shareText = `${devotional.title}\n\n${preview}\n${devotional.verse ? `\n${devotional.verse}` : ""}\n\n${link}`;

  const handleWhatsAppShare = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank");
  };

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
        {/* WhatsApp */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleWhatsAppShare}
          className="gap-2 !bg-[#25D366] hover:!bg-[#1DA851] text-white border-none shadow-md"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </Button>
        {/* Facebook */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleFacebookShare}
          className="gap-2 !bg-[#1877F3] hover:!bg-[#1452a0] text-white border-none shadow-md"
        >
          <Facebook className="h-4 w-4" />
          Facebook
        </Button>
        {/* Instagram */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleInstagramShare}
          className="gap-2 bg-gradient-to-tr from-[#F9CE34] via-[#E4405F] to-[#8a3ab9] hover:opacity-90 text-white border-none shadow-md"
        >
          <Instagram className="h-4 w-4" />
          Instagram
        </Button>
      </div>
    </div>
  )
}
