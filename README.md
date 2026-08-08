# 🐾 萌宠 MBTI

通过趣味宠物人格测试，发现属于你家毛孩子的独特人格。

> 🐱 猫猫：基于 Litchfield et al. (2017) "The Feline Five" 科学研究 (n=2,802)  
> 🐕 狗狗：基于 Broseghini et al. (2023) C-BARQ 意大利验证版 (n=806)  
> 完成 5 分钟测试，解锁专属宠物 MBTI 人格，生成海报分享到朋友圈！

---

## ✨ 功能

- 🐱 **宠物信息填写** — 输入名字、选择猫/狗类型、搜索选择品种
- 🧠 **智能分轨测试** — 猫猫 25 题（Feline Five 五维模型），狗狗 25 题（C-BARQ 13 因子模型）
- 🔬 **科学评分算法** — 猫：加权因子分 + Z 分数常模校准（n=2,802）；狗：因子载荷加权 + Z 分数常模校准（n=806）+ α 加权 MBTI 映射
- 🎯 **16 种 MBTI 人格** — 猫狗各有专属品种昵称 + 品种专属 IP 形象图（34 品种 × 16 性格），含解读、金句、养护建议
- ⏳ **加载动画** — 可爱的 Emoji 粒子动画，制造期待感
- 📤 **分享海报** — 高清 Canvas 海报，含品种专属形象 + 人格解读，长按保存分享到微信/小红书
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

**流程：** 加权因子分 → Z 分数常模校准 → 五维→四维 MBTI 映射 → 16 种猫格

### 狗狗：C-BARQ 13 因子模型

基于 **Broseghini et al. (2023)**（Animals，n=806 只意大利犬），从 C-BARQ 验证版 62 题中精选 25 题：

```
rawScore_f = Σ loading_i × answer_i        (0-4 频率量表)
zScore_f   = (rawScore_f - μ_f) / σ_f       (n=806 常模)
z_dim      = (Σα_pos×z_pos - Σα_neg×z_neg) / Σα
```

| 因子 | α | MBTI 方向 |
|---|---|---|
| F1 陌生人攻击/恐惧 | .895 | → I |
| F2 狗导向恐惧 | .865 | → I |
| F6 狗导向攻击 | .814 | → E |
| F5 追逐 | .826 | → S |
| F10 非社交恐惧 | .561 | → S |
| F8 可训练性 | .690 | → N |
| F3 主人导向攻击 | .761 | → T |
| F7 依恋/求关注 | .739 | → F |
| F13 触觉敏感 | .664 | → F |
| F4 分离焦虑 | .773 | → J |
| F12 排泄问题 | .776 | → J |
| F11 兴奋性 | .615 | → P |

**流程：** 加权因子分 → Z 分数常模校准 → α 加权 MBTI 映射 → 16 种犬型人格

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
│   ├── test/page.tsx             # 测试页（信息填写 + 猫狗各25题）
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
│   ├── breeds.ts                  # 34 个猫狗品种数据 + slug 映射
│   ├── questions.ts               # 狗狗 25 题（C-BARQ）+ 猫猫 25 题
│   ├── dog-results.ts             # 16 种犬型人格（品种昵称）
│   ├── cat-results.ts             # 16 种猫型人格（猫专属名）
│   ├── cat-items.json             # 48 道 Feline Five 题库
│   └── dog-quiz/items.json        # 25 道 C-BARQ 题库
├── lib/
│   ├── dog-calculator.ts          # 狗狗 MBTI 计算（C-BARQ + α 加权）
│   ├── cat-calculator.ts          # 猫猫 MBTI 计算（Feline Five + 映射）
│   ├── mbti-utils.ts              # MBTI 工具函数
│   ├── breed-image.ts             # 品种图片路径工具
│   ├── dog-quiz/                  # 狗狗算法核心库（6 个模块）
│   │   ├── types.ts               #   C-BARQ 类型 + 因子 α
│   │   ├── items.ts               #   题库加载
│   │   ├── scoring.ts             #   加权因子评分 + Z 分数
│   │   ├── norm-params.ts         #   常模参数 (n=806)
│   │   ├── mbti-mapper.ts         #   α 加权 MBTI 映射
│   │   └── confidence.ts          #   置信度检测
│   ├── cat-quiz/                  # 猫猫算法核心库（10 个模块）
│   │   ├── types.ts               #   类型定义
│   │   ├── items.ts               #   题库管理
│   │   ├── validate.ts            #   输入验证
│   │   ├── scoring.ts             #   加权因子评分
│   │   ├── confidence.ts          #   置信度计算
│   │   ├── norm-params.ts         #   常模参数 (μ, σ)
│   │   ├── dimension-meta.ts      #   维度元数据 (α, 方差)
│   │   ├── mbti-mapper.ts         #   五维→四维 MBTI 映射
│   │   ├── cat-types.ts           #   16 种猫人格名称
│   │   └── subfacets.ts           #   Extraversion 子维度
│   ├── poster-renderer.ts         # 海报 Canvas 合成
│   ├── analytics.ts               # 埋点工具
│   └── supabase-server.ts         # 服务端数据库客户端
├── types/index.ts                 # TypeScript 类型定义
└── public/
    └── images/breeds/             # 35 品种 × 16 性格 = 560 张品种专属形象图
```

---

## 🐱🐶 品种形象图

每个品种包含 **16 张 MBTI 人格形象图**，覆盖全部 16 种宠物人格类型（ENFJ、ENFP、ENTJ、ENTP、ESFJ、ESFP、ESTJ、ESTP、INFJ、INFP、INTJ、INTP、ISFJ、ISFP、ISTJ、ISTP）。共 **35 品种 × 16 性格 = 560 张**。

目录结构：`public/images/breeds/{猫|狗}/{品种slug}/{MBTI类型}.png`

### 🐱 猫猫品种（17 种）

| # | 中文名 | 目录 slug | 简介 |
|---|---|---|---|
| 1 | 阿比西尼亚 | `abyssinian` | 古埃及血统的优雅猎手，精力充沛，热爱探索 |
| 2 | 波斯猫 | `persian` | 猫中贵族，温柔安静，长毛蓬松的颜值担当 |
| 3 | 布偶猫 | `ragdoll` | 蓝眼睛的甜美天使，性格温顺黏人，抱起来就软掉 |
| 4 | 德文卷毛 | `devon-rex` | 精灵耳卷毛猫，聪明好动，被称为"猫中贵宾犬" |
| 5 | 黑猫 | `black-cat` | 神秘优雅的暗夜精灵，古灵精怪，打破刻板印象 |
| 6 | 加菲猫 | `exotic-shorthair` | 扁脸呆萌，安静慵懒，异国短毛猫的"憨憨担当" |
| 7 | 金渐层 | `golden-shaded` | 金色毛发的英短贵族，圆脸大眼睛，自带富贵感 |
| 8 | 橘猫 | `orange-tabby` | 中华名捕，食量惊人，十橘九胖的国民橘座 |
| 9 | 蓝猫 | `british-blue` | 蓝灰色短毛圆脸，沉稳淡定，英伦绅士范 |
| 10 | 美短 | `american-shorthair` | 经典虎斑纹，活泼健康，美国家庭的国民猫咪 |
| 11 | 缅因猫 | `maine-coon` | 猫中巨人，蓬松大尾巴，外表霸气内心温柔 |
| 12 | 奶牛猫 | `tuxedo-cat` | 黑白燕尾服，猫中哈士奇，精力旺盛的搞笑担当 |
| 13 | 暹罗猫 | `siamese` | 蓝宝石眼睛，重点色面具，话痨级别的社交达人 |
| 14 | 三花猫 | `calico` | 白橘黑三色拼接，几乎全是母猫，招财吉祥物 |
| 15 | 银渐层 | `silver-shaded` | 银白色渐层毛，绿眸高冷，仙气飘飘的小傲娇 |
| 16 | 英短 | `british-shorthair` | 圆脸圆眼圆身材，憨态可掬的微笑天使 |
| 17 | 中华田园猫 | `chinese-domestic-cat` | 本土混血猫咪，皮实好养，独立又聪明 |

### 🐶 狗狗品种（18 种）

| # | 中文名 | 目录 slug | 简介 |
|---|---|---|---|
| 1 | 阿拉斯加 | `alaskan-malamute` | 雪橇三傻之大傻，体型壮硕，拆家潜力巨大但忠心护主 |
| 2 | 比熊 | `bichon-frise` | 白色棉花糖，开朗黏人，不掉毛的家庭伴侣 |
| 3 | 伯恩山 | `bernese-mountain-dog` | 瑞士三色大型工作犬，温顺沉稳，天生拉车小能手 |
| 4 | 边牧 | `border-collie` | 犬界智商天花板，工作狂，没羊放也能牧小孩 |
| 5 | 博美 | `pomeranian` | 小体型大嗓门，毛茸茸的活泼小狐狸 |
| 6 | 柴犬 | `shiba-inu` | 日本国宝表情包，独立倔强，微笑治愈但很有个性 |
| 7 | 德牧 | `german-shepherd` | 警犬之王，忠诚勇敢，智商和战斗力双在线 |
| 8 | 法斗 | `french-bulldog` | 蝙蝠耳小短腿，蠢萌打鼾，都市青年的心头好 |
| 9 | 哈士奇 | `husky` | 雪橇三傻之二傻，表情帝，脑回路清奇的拆迁队长 |
| 10 | 吉娃娃 | `chihuahua` | 世界上最小的狗，胆子比体型大，对主人极度忠诚 |
| 11 | 金毛 | `golden-retriever` | 狗中暖男，微笑天使，智商高脾气好的人间理想 |
| 12 | 柯基 | `corgi` | 电动小马达蜜桃臀，女王最爱，短腿界的人气王 |
| 13 | 拉布拉多 | `labrador` | 导盲犬首选，贪吃好脾气，永远长不大的快乐小狗 |
| 14 | 萨摩耶 | `samoyed` | 雪橇三傻之三傻，白毛微笑天使，萨摩耶的微笑能融化一切 |
| 15 | 泰迪/贵宾 | `poodle` | 智商第二的卷毛精，小巧机灵，人精本精 |
| 16 | 雪纳瑞 | `schnauzer` | 白胡子小老头，机警勇敢，不掉毛的公寓好伴侣 |
| 17 | 约克夏 | `yorkshire-terrier` | 丝质长毛小型犬，勇敢自信的小不点 |
| 18 | 中华田园犬 | `chinese-rural-dog` | 神州大地混血土狗，忠诚护家，天生的生存智慧 |

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
2. **Broseghini, A. et al.** (2023). Canine Behavioral Assessment and Research Questionnaire (C-BARQ): Validation of the Italian Translation. *Animals*, 13, 1254.
3. **DiStefano, C., Zhu, M., & Mîndrilă, D.** (2009). Understanding and using factor scores. *Practical Assessment, Research, and Evaluation*, 14(20).
4. **Lozano, L. M. et al.** (2008). Effect of the number of response categories on the reliability and validity of rating scales. *Methodology*, 4(2), 73–79.

---

## 📄 许可

MIT
