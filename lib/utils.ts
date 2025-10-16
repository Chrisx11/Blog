import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { createClient } from '@supabase/supabase-js'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const supabaseUrl = 'https://ixeauychjgidflnrvxnr.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4ZWF1eWNoamdpZGZsbnJ2eG5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MzYyMjUsImV4cCI6MjA3NjExMjIyNX0.Bo9MJpASqg9C8WoMp2U6hrTAFvFjZ_KKLaaVP_4QGkE'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
