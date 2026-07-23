-- 萌宠MBTI — 数据埋点事件表
-- 在 Supabase SQL Editor 中执行此脚本
-- 选择 "Run and enable RLS" 执行

CREATE TABLE IF NOT EXISTS analytics_events (
  id          BIGSERIAL PRIMARY KEY,
  session_id  UUID NOT NULL,
  event       TEXT NOT NULL,
  pet_type    TEXT,
  mbti_type   TEXT,
  screen_size TEXT,
  user_agent  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_events_session ON analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_events_event ON analytics_events(event);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON analytics_events(created_at);

-- RLS 已启用。API 路由使用 service_role key（lib/supabase-server.ts），绕过 RLS。
-- 前端不直接访问 Supabase，所有数据库操作通过 /api/* 路由。
