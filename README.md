# 🐾 萌宠 MBTI

通过趣味宠物人格测试，发现属于你家毛孩子的独特人格。

> 🐱 基于 Litchfield et al. (2017) "The Feline Five" 科学研究的猫猫专属算法  
> 🐕 一只 INTJ 猫咪战略家，还是一只 ENFP 快乐小狗？完成 5 分钟测试，解锁专属宠物 MBTI 人格，生成海报分享到朋友圈！

---

## ✨ 功能

- 🐱 **宠物信息填写** — 输入名字、选择猫/狗/其他、年龄
- 🧠 **智能分轨测试** — 猫猫专属 25 题（Feline Five 五维模型），狗狗 20 题（经典 MBTI 四维）
- 🔬 **科学评分算法** — 猫：加权因子分 + Z 分数常模校准（n=2,802）；狗：Likert 加权计分
- 🎯 **16 种 MBTI 人格** — 猫狗各有专属昵称（发明家猫/冒险家猫…），含解读、金句、养护建议
- ⏳ **加载动画** — 可爱的 Emoji 粒子动画，制造期待感
- 📤 **分享海报** — 高清 Canvas 海报，长按保存分享到微信/小红书
- 📊 **数据埋点** — 匿名追踪用户行为（完成率、分享率、猫狗分群）
- 📱 **移动端优先** — 375px 基准设计，完美适配手机屏幕

---

## 🧪 猫猫算法：Feline Five 五维模型

猫猫测试基于 **Litchfield et al. (2017)** 同行评审研究（PLoS ONE，n=2,802 只家猫），使用 **加权和因子评分算法**（DiStefano et al., 2009）：

```
F_f = Σ |loading_i| × adjusted_score_i
```

| 维度 | Cronbach's α | 题目数 |
|---|---|---|
| 神经质 Neuroticism | .90 | 14 |
| 外向性 Extraversion | .80 | 12 |
| 支配性 Dominance | .80 | 8 |
| 冲动性 Impulsiveness | .72 | 7 |
| 亲和性 Agreeableness | .78 | 7 |

**评分流程：** 加权因子分 → Z 分数常模校准 → 五维→四维 MBTI 映射 → 16 种猫格类型

---

## 🛠 技术栈

| 分类 | 技术 |
|---|---|
| 框架 | Next.js 16 + React 19 |
| 语言 | TypeScript（strict） |
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
│   ├── test/page.tsx             # 测试页（信息填写 + 猫25题/狗20题）
│   ├── loading/page.tsx          # 加载动画页
│   ├── result/page.tsx           # 结果展示页
│   ├── share/page.tsx            # 分享海报页
│   └── api/
│       ├── calculate/            # MBTI 计算 API（猫/狗双轨）
│       └── track/                # 数据埋点 API
├── components/
│   ├── test/                     # 测试相关组件
│   │   ├── PetInfoForm.tsx       # 宠物信息表单
│   │   ├── QuestionCard.tsx      # 单题卡片（5点Likert）
│   │   └── ProgressBar.tsx       # 进度条
│   └── result/
│       └── ResultCard.tsx        # 结果卡片（猫/狗分名）
├── data/
│   ├── questions.ts              # 狗狗 20 题 + 猫猫 25 题
│   ├── results.ts                # 16 种 MBTI 人格（狗）
│   ├── cat-results.ts            # 16 种 MBTI 人格（猫专属名）
│   └── cat-items.json            # 48 道 Feline Five 题库
├── lib/
│   ├── mbti-calculator.ts        # 狗狗 MBTI 计算（Likert 加权）
│   ├── cat-calculator.ts         # 猫猫 MBTI 计算（Feline Five + 映射）
│   ├── cat-quiz/                 # 猫猫算法核心库（10 个模块）
│   │   ├── types.ts              #   类型定义
│   │   ├── items.ts              #   题库管理
│   │   ├── validate.ts           #   输入验证
│   │   ├── scoring.ts            #   加权因子评分
│   │   ├── confidence.ts         #   置信度计算
│   │   ├── norm-params.ts        #   常模参数 (μ, σ)
│   │   ├── dimension-meta.ts     #   维度元数据 (α, 方差)
│   │   ├── mbti-mapper.ts        #   五维→四维 MBTI 映射
│   │   ├── cat-types.ts          #   16 种猫人格名称
│   │   └── subfacets.ts          #   Extraversion 子维度
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
- `test_started` / `test_completed` — 测试开始/完成（含 `pet_type` 分群）
- `page_view_result` — 查看结果
- `click_share` / `share_completed` — 分享行为
- `click_retest` — 重新测试

---

## 📖 参考文献

1. **Litchfield, C. A. et al.** (2017). The 'Feline Five': An exploration of personality in pet cats (*Felis catus*). *PLoS ONE*, 12(8), e0183455.
2. **DiStefano, C., Zhu, M., & Mîndrilă, D.** (2009). Understanding and using factor scores. *Practical Assessment, Research, and Evaluation*, 14(20).
3. **Lozano, L. M. et al.** (2008). Effect of the number of response categories on the reliability and validity of rating scales. *Methodology*, 4(2), 73–79.

---

## 📄 许可

MIT
