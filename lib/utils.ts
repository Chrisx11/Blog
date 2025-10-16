import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { supabase } from "./supabaseClient";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export { supabase }

export async function uploadImageToSupabase(file: File, userId: string) {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from("devotional-images")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Erro no upload:", error);
      throw error;
    }

    const { data: publicUrl } = supabase.storage
      .from("devotional-images")
      .getPublicUrl(fileName);
    return publicUrl.publicUrl;
  } catch (error) {
    console.error("Erro no upload da imagem:", error);
    throw error;
  }
}
