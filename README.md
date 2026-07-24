# 🐾 萌宠 MBTI

通过趣味宠物人格测试，发现属于你家毛孩子的独特人格。

> 一只 INTJ 猫咪军师，还是一只 ENFP 快乐小狗？完成 5 分钟测试，解锁专属宠物 MBTI 人格，生成海报分享到朋友圈！

---

## ✨ 功能

- 🐱 **宠物信息填写** — 输入名字、选择猫/狗/其他、年龄
- 🧠 **20 道行为测试题** — 场景化问题，贴近真实宠物日常
- 🎯 **16 种 MBTI 人格** — 每种人格配有专属昵称、解读、金句、建议
- ⏳ **加载动画** — 可爱的 Emoji 粒子动画，制造期待感
- 📤 **分享海报** — 高清海报，长按保存分享到微信/小红书
- 📊 **数据埋点** — 匿名追踪用户行为（完成率、分享率）
- 📱 **移动端优先** — 375px 基准设计，完美适配手机屏幕

---

## 🛠 技术栈

| 分类 | 技术 |
|---|---|
| 框架 | Next.js 16 + React 19 |
| 语言 | TypeScript |
| 样式 | Tailwind CSS v4 |
| 动画 | Framer Motion |
| 海报生成 | Canvas API（客户端合成） |
| 数据库 | Supabase (PostgreSQL) |
| 部署 | Vercel |

---

## 🚀 本地运行

```bash
# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local，填入你的 Supabase URL 和 Key

# 启动开发服务器
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看效果。

---

## 📁 项目结构

```
src/
├── app/
│   ├── page.tsx                  # 首页
│   ├── layout.tsx                # 全局布局 + OG 标签
│   ├── not-found.tsx             # 404 页面
│   ├── error.tsx                 # 全局错误边界
│   ├── test/page.tsx             # 测试页（信息填写 + 20题）
│   ├── loading/page.tsx          # 加载动画页
│   ├── result/page.tsx           # 结果展示页
│   ├── share/page.tsx            # 分享海报页
│   └── api/
│       ├── calculate/            # MBTI 计算 API
│       └── track/                # 数据埋点 API
├── components/
│   ├── test/                     # 测试相关组件
│   │   ├── PetInfoForm.tsx       # 宠物信息表单
│   │   ├── QuestionCard.tsx      # 单题卡片
│   │   └── ProgressBar.tsx       # 进度条
│   └── result/
│       └── ResultCard.tsx        # 结果卡片
├── data/
│   ├── questions.ts              # 20 道测试题
│   └── results.ts                # 16 种 MBTI 人格
├── lib/
│   ├── mbti-calculator.ts        # MBTI 计算逻辑
│   ├── poster-renderer.ts        # 海报 Canvas 合成
│   ├── analytics.ts              # 埋点工具
│   └── supabase-server.ts        # 服务端数据库客户端
├── types/index.ts                # TypeScript 类型定义
└── public/
    └── images/personalities/     # 16 张 MBTI 人格 IP 形象图
```

---

## 🔒 环境变量

| Key | 说明 |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 匿名 Key（客户端安全） |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase 服务端 Key（仅服务端，不暴露） |

---

## 📊 数据埋点

追踪以下关键事件，用于验证产品传播闭环：

- `page_view_home` — 首页访问
- `click_start_test` — 点击开始测试
- `test_started` / `test_completed` — 测试开始/完成
- `page_view_result` — 查看结果
- `click_share` / `share_completed` — 分享行为
- `click_retest` — 重新测试

---

## 📄 许可

MIT
