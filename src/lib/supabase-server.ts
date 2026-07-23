import { createClient } from "@supabase/supabase-js";

// 服务端 Supabase — 使用 service_role key，绕过 RLS
// 仅在 API Routes / Server Components 中使用
// 绝不 import 到客户端组件

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export const supabaseServer = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
