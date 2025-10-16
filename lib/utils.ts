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
    
    // Primeiro, vamos tentar criar o bucket se não existir
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === "devotional-images");
    
    if (!bucketExists) {
      // Criar o bucket se não existir
      const { error: createError } = await supabase.storage.createBucket("devotional-images", {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        fileSizeLimit: 5242880 // 5MB
      });
      
      if (createError) {
        console.error("Erro ao criar bucket:", createError);
        // Se não conseguir criar, usar um bucket genérico
        const { data, error } = await supabase.storage
          .from("public")
          .upload(fileName, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (error) {
          console.error("Erro no upload:", error);
          throw error;
        }

        const { data: publicUrl } = supabase.storage
          .from("public")
          .getPublicUrl(fileName);
        
        return publicUrl.publicUrl;
      }
    }
    
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
