import { notFound } from "next/navigation"
import Image from "next/image"
import { Calendar, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ShareButtons } from "@/components/share-buttons"
import Link from "next/link"
import { supabase } from "@/lib/utils"
import Head from "next/head"

export async function generateStaticParams() {
  const { data: devotionals } = await supabase
    .from("devotionals")
    .select("id")
    .order("date", { ascending: false })

  return devotionals?.map((devotional) => ({
    id: devotional.id,
  })) || []
}

export default async function DevotionalPage({ params }: { params: { id: string } }) {
  const { data: devotional, error } = await supabase
    .from("devotionals")
    .select("*")
    .eq("id", params.id)
    .single()

  if (error || !devotional) {
    notFound()
  }

  // Mapear campos do banco para o formato esperado
  const devotionalData = {
    ...devotional,
    imageUrl: devotional.image_url
  }

  return (
    <>
      <Head>
        <title>{devotionalData.title} | Meu Lugar com Ele</title>
        <meta property="og:title" content={devotionalData.title} />
        <meta property="og:description" content={devotionalData.verse || devotionalData.content.slice(0, 120)} />
        <meta property="og:image" content={devotionalData.imageUrl || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4CcxaLx-7mwPbq4A05YAoMvAO-wYqzby1Tw&s'} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://seu-dominio.com/devocional/${devotionalData.id}`} /> {/* TODO: trocar domínio para produção */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={devotionalData.title} />
        <meta name="twitter:description" content={devotionalData.verse || devotionalData.content.slice(0, 120)} />
        <meta name="twitter:image" content={devotionalData.imageUrl || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4CcxaLx-7mwPbq4A05YAoMvAO-wYqzby1Tw&s'} />
      </Head>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Link href="/">
            <Button
              variant="ghost"
              className="mb-6 -ml-4 hover:bg-primary/10 transition-all duration-300 hover:translate-x-[-4px]"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>

          <article className="bg-card rounded-xl overflow-hidden shadow-2xl border border-border/50 hover:shadow-3xl transition-shadow duration-500">
            <div className="relative h-64 md:h-96 w-full overflow-hidden">
              <Image
                src={devotionalData.imageUrl || "/placeholder.svg"}
                alt={devotionalData.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
            </div>

            <div className="p-6 md:p-12 bg-card/98 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                <Calendar className="h-4 w-4" />
                <time dateTime={devotionalData.date}>
                  {new Date(devotionalData.date).toLocaleDateString("pt-BR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </time>
              </div>

              <h1 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-8 text-balance leading-tight animate-in slide-in-from-bottom-2 duration-500">
                {devotionalData.title}
              </h1>

              {devotionalData.verse && (
                <blockquote className="border-l-4 border-primary pl-6 mb-10 italic text-lg md:text-xl text-muted-foreground bg-primary/5 py-4 rounded-r-lg shadow-md animate-in slide-in-from-left duration-500 delay-100">
                  {devotionalData.verse}
                </blockquote>
              )}

              <div className="prose prose-lg md:prose-xl max-w-none mb-10 text-foreground leading-relaxed animate-in fade-in duration-700 delay-200">
                {devotionalData.content.split("\n\n").map((paragraph, index) => (
                  <p
                    key={index}
                    className="mb-8 text-pretty first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:text-primary first-letter:mr-1 first-letter:float-left"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              {devotionalData.author && (
                <p className="text-base text-muted-foreground mb-10 italic border-t border-border/50 pt-6">
                  Por {devotionalData.author}
                </p>
              )}

              <div className="pt-8 border-t border-border/50 shadow-sm">
                <ShareButtons devotional={devotionalData} />
              </div>
            </div>
          </article>
        </div>
      </div>
    </>
  )
}
