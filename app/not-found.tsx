import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-serif font-bold text-foreground mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-foreground mb-4">Página não encontrada</h2>
        <p className="text-muted-foreground mb-8">O devocional que você está procurando não existe.</p>
        <Link href="/">
          <Button>
            <Home className="h-4 w-4 mr-2" />
            Voltar para Início
          </Button>
        </Link>
      </div>
    </div>
  )
}
