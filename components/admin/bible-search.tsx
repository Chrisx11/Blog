"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, BookOpen, Copy, Check } from "lucide-react"

interface BibleVerse {
  book: string
  chapter: number
  verse: number
  text: string
}

interface BibleSearchProps {
  onVerseSelect?: (verse: string) => void
}

export function BibleSearch({ onVerseSelect }: BibleSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBook, setSelectedBook] = useState("")
  const [selectedChapter, setSelectedChapter] = useState("")
  const [selectedVerse, setSelectedVerse] = useState("")
  const [searchResults, setSearchResults] = useState<BibleVerse[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [copiedVerse, setCopiedVerse] = useState<string | null>(null)

  const books = [
    "Gênesis", "Êxodo", "Levítico", "Números", "Deuteronômio", "Josué", "Juízes", "Rute",
    "1 Samuel", "2 Samuel", "1 Reis", "2 Reis", "1 Crônicas", "2 Crônicas", "Esdras", "Neemias",
    "Ester", "Jó", "Salmos", "Provérbios", "Eclesiastes", "Cantares", "Isaías", "Jeremias",
    "Lamentações", "Ezequiel", "Daniel", "Oséias", "Joel", "Amós", "Obadias", "Jonas",
    "Miquéias", "Naum", "Habacuque", "Sofonias", "Ageu", "Zacarias", "Malaquias",
    "Mateus", "Marcos", "Lucas", "João", "Atos", "Romanos", "1 Coríntios", "2 Coríntios",
    "Gálatas", "Efésios", "Filipenses", "Colossenses", "1 Tessalonicenses", "2 Tessalonicenses",
    "1 Timóteo", "2 Timóteo", "Tito", "Filemom", "Hebreus", "Tiago", "1 Pedro", "2 Pedro",
    "1 João", "2 João", "3 João", "Judas", "Apocalipse"
  ]

  const chapters = Array.from({ length: 150 }, (_, i) => i + 1)
  const verses = Array.from({ length: 200 }, (_, i) => i + 1)

  const searchVerses = async () => {
    if (!searchQuery.trim()) return

    setIsLoading(true)
    try {
      // Usando API gratuita da Bíblia (Bible API)
      const response = await fetch(
        `https://bible-api.com/${encodeURIComponent(searchQuery)}?translation=almeida`
      )
      
      if (response.ok) {
        const data = await response.json()
        if (data.verses) {
          setSearchResults(data.verses.map((v: any) => ({
            book: data.book_name,
            chapter: data.chapter,
            verse: v.verse,
            text: v.text
          })))
        } else {
          // Se não encontrar, tenta com uma busca mais genérica
          setSearchResults([{
            book: data.book_name || "Desconhecido",
            chapter: data.chapter || 1,
            verse: data.verse || 1,
            text: data.text || "Versículo não encontrado"
          }])
        }
      } else {
        setSearchResults([])
      }
    } catch (error) {
      console.error("Erro ao buscar versículos:", error)
      setSearchResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const searchSpecificVerse = async () => {
    if (!selectedBook || !selectedChapter || !selectedVerse) return

    const query = `${selectedBook} ${selectedChapter}:${selectedVerse}`
    setSearchQuery(query)
    setIsLoading(true)

    try {
      const response = await fetch(
        `https://bible-api.com/${encodeURIComponent(query)}?translation=almeida`
      )
      
      if (response.ok) {
        const data = await response.json()
        setSearchResults([{
          book: data.book_name,
          chapter: data.chapter,
          verse: data.verse,
          text: data.text
        }])
      }
    } catch (error) {
      console.error("Erro ao buscar versículo:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const copyVerse = async (verse: BibleVerse) => {
    const verseText = `${verse.book} ${verse.chapter}:${verse.verse} - ${verse.text}`
    await navigator.clipboard.writeText(verseText)
    setCopiedVerse(`${verse.book} ${verse.chapter}:${verse.verse}`)
    setTimeout(() => setCopiedVerse(null), 2000)
    
    if (onVerseSelect) {
      onVerseSelect(verseText)
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card className="shadow-lg border-border/50">
        <CardHeader className="p-4 sm:p-6 pb-4">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />
            Busca Rápida de Versículos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6 pt-0">
          {/* Busca por texto */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Buscar por texto ou referência:</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                placeholder="Ex: João 3:16, amor, fé..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchVerses()}
                className="text-sm sm:text-base"
              />
              <Button onClick={searchVerses} disabled={isLoading} className="w-full sm:w-auto rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                <Search className="h-4 w-4 mr-2" />
                <span className="sm:inline">Buscar</span>
              </Button>
            </div>
          </div>

          {/* Busca específica */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Busca específica:</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              <Select value={selectedBook} onValueChange={setSelectedBook}>
                <SelectTrigger className="text-sm sm:text-base rounded-lg shadow-sm">
                  <SelectValue placeholder="Livro" />
                </SelectTrigger>
                <SelectContent>
                  {books.map((book) => (
                    <SelectItem key={book} value={book} className="text-sm">
                      {book}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedChapter} onValueChange={setSelectedChapter}>
                <SelectTrigger className="text-sm sm:text-base rounded-lg shadow-sm">
                  <SelectValue placeholder="Capítulo" />
                </SelectTrigger>
                <SelectContent>
                  {chapters.map((chapter) => (
                    <SelectItem key={chapter} value={chapter.toString()} className="text-sm">
                      {chapter}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedVerse} onValueChange={setSelectedVerse}>
                <SelectTrigger className="text-sm sm:text-base rounded-lg shadow-sm">
                  <SelectValue placeholder="Versículo" />
                </SelectTrigger>
                <SelectContent>
                  {verses.map((verse) => (
                    <SelectItem key={verse} value={verse.toString()} className="text-sm">
                      {verse}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button 
                onClick={searchSpecificVerse} 
                disabled={!selectedBook || !selectedChapter || !selectedVerse}
                className="w-full sm:w-auto text-sm sm:text-base rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
              >
                Buscar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resultados */}
      {isLoading && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Buscando versículos...</p>
        </div>
      )}

      {searchResults.length > 0 && (
        <Card className="shadow-lg border-border/50">
          <CardHeader className="p-4 sm:p-6 pb-4">
            <CardTitle className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Resultados</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="space-y-3 sm:space-y-4">
              {searchResults.map((verse, index) => (
                <div
                  key={index}
                  className="p-3 sm:p-4 border border-border rounded-xl bg-card hover:bg-accent/50 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-foreground mb-2 text-sm sm:text-base">
                        {verse.book} {verse.chapter}:{verse.verse}
                      </h4>
                      <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                        {verse.text}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyVerse(verse)}
                      className="flex-shrink-0 w-full sm:w-auto rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      {copiedVerse === `${verse.book} ${verse.chapter}:${verse.verse}` ? (
                        <Check className="h-4 w-4 mr-2" />
                      ) : (
                        <Copy className="h-4 w-4 mr-2" />
                      )}
                      <span className="sm:inline">Copiar</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
