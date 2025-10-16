import { DevotionalCard } from "@/components/devotional-card"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/utils"

interface DevotionalListProps {
  searchQuery?: string
}

export function DevotionalList({ searchQuery = "" }: DevotionalListProps) {
  const [devotionals, setDevotionals] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchDevotionals() {
      setIsLoading(true)
      setError("")
      let query = supabase
        .from("devotionals")
        .select("*")
        .order("date", { ascending: false })
      if (searchQuery) {
        query = query.ilike("title", `%${searchQuery}%`)
      }
      const { data, error } = await query
      if (error) {
        setError("Erro ao carregar devocionais: " + error.message)
        setDevotionals([])
      } else {
        setDevotionals(data || [])
      }
      setIsLoading(false)
    }
    fetchDevotionals()
  }, [searchQuery])

  if (isLoading) {
    return <div className="text-center py-12"><p className="text-lg text-muted-foreground">Carregando devocionais...</p></div>
  }
  if (error) {
    return <div className="text-center text-destructive py-10">{error}</div>
  }
  if (devotionals.length === 0) {
    return <div className="text-center py-12"><p className="text-muted-foreground text-lg">Nenhum devocional encontrado{searchQuery ? ` para "${searchQuery}"` : ""}</p></div>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {devotionals.map((devotional) => (
        <DevotionalCard key={devotional.id} devotional={{
          ...devotional,
          imageUrl: devotional.image_url // mapeia snake para camel para o card
        }} />
      ))}
    </div>
  )
}
