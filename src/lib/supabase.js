import { createClient } from "@supabase/supabase-js";

const URL = import.meta.env.VITE_SUPABASE_URL || "https://vafdtlclokssurcfydqh.supabase.co";
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const supabase = createClient(URL, KEY, {
  auth: { persistSession: false },
});

export const hasSupabase = Boolean(URL && KEY);
