import { createClient } from "@supabase/supabase-js";

// 客户端 Supabase — 仅用 anon key
// 前端不直接调 Supabase，这个实例预留给未来客户端场景
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
