"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DevotionalForm } from "@/components/admin/devotional-form"
import { DevotionalListAdmin } from "@/components/admin/devotional-list-admin"
import { Plus } from "lucide-react"
import type { Devotional } from "@/lib/types"
import { devotionals as initialDevotionals } from "@/lib/data"
import { supabase } from "@/lib/utils"

export function DevotionalManager({ overrideMode, setOverrideMode }: { overrideMode?: "list" | "new", setOverrideMode?: (key: "list"|"new")=>void }) {
  const [devotionals, setDevotionals] = useState<Devotional[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [editingDevotional, setEditingDevotional] = useState<Devotional | null>(null)
  const [error, setError] = useState<string>("");
  const searchParams = useSearchParams();

  // Buscar devocionais do Supabase ao montar componente
  useEffect(() => {
    async function fetchDevotionals() {
      const { data, error } = await supabase
        .from("devotionals")
        .select("*")
        .order("date", { ascending: false })
      if (error) {
        setError("Erro ao buscar devocionais: " + error.message)
        return
      }
      setDevotionals(data || [])
    }
    fetchDevotionals()
  }, [])

  useEffect(() => {
    // Este efeito prioriza overrideMode
    if (overrideMode === "new") {
      setIsCreating(true)
      setEditingDevotional(null)
    } else if (overrideMode === "list") {
      setIsCreating(false)
      setEditingDevotional(null)
    } else if (searchParams.get("create") === "1") {
      setIsCreating(true)
      setEditingDevotional(null)
    }
  }, [overrideMode, searchParams])

  const handleCreate = async (devotional: Omit<Devotional, "id">) => {
    setError("");
    // Corrigir camelCase para snake_case para o backend
    const devotionalToSave = {
      ...devotional,
      image_url: devotional.image_url || devotional.imageUrl || ""
    };
    delete devotionalToSave.imageUrl;
    const { data, error } = await supabase
      .from("devotionals")
      .insert([devotionalToSave])
      .select()
      .single();
    if (error) {
      setError("Erro ao criar devocional: " + error.message)
      return;
    }
    setDevotionals([data, ...devotionals])
    setIsCreating(false)
    setEditingDevotional(null)
    if (setOverrideMode) setOverrideMode("list")
  }

  const handleUpdate = async (id: string, devotional: Omit<Devotional, "id">) => {
    setError("");
    // Monta objeto compatível com o schema do banco (snake_case)
    const devotionalToSave = {
      ...devotional,
      image_url: devotional.image_url || devotional.imageUrl || ""
    };
    delete devotionalToSave.imageUrl;
    const { data, error } = await supabase
      .from("devotionals")
      .update(devotionalToSave)
      .eq("id", id)
      .select()
      .single();
    if (error) {
      setError("Erro ao atualizar devocional: " + error.message);
      return;
    }
    setDevotionals(devotionals.map((d) => (d.id === id ? data : d)));
    setEditingDevotional(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este devocional?")) {
      setDevotionals(devotionals.filter((d) => d.id !== id))
    }
  }

  const handleEdit = (devotional: Devotional) => {
    setEditingDevotional(devotional)
    setIsCreating(false)
  }

  const handleCancel = () => {
    setIsCreating(false)
    setEditingDevotional(null)
    if (setOverrideMode) setOverrideMode("list")
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-300 text-red-600 px-3 py-2 sm:px-4 rounded-md text-sm sm:text-base">
          {error}
        </div>
      )}
      {!isCreating && !editingDevotional && (
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
              <CardTitle className="text-lg sm:text-xl">Devocionais</CardTitle>
              <Button onClick={() => setIsCreating(true)} className="gap-2 w-full sm:w-auto">
                <Plus className="h-4 w-4" />
                <span className="sm:inline">Novo Devocional</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <DevotionalListAdmin devotionals={devotionals} onEdit={handleEdit} onDelete={handleDelete} />
          </CardContent>
        </Card>
      )}

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Criar Novo Devocional</CardTitle>
          </CardHeader>
          <CardContent>
            <DevotionalForm onSubmit={handleCreate} onCancel={handleCancel} />
          </CardContent>
        </Card>
      )}

      {editingDevotional && (
        <Card>
          <CardHeader>
            <CardTitle>Editar Devocional</CardTitle>
          </CardHeader>
          <CardContent>
            <DevotionalForm
              devotional={editingDevotional}
              onSubmit={(data) => handleUpdate(editingDevotional.id, data)}
              onCancel={handleCancel}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
