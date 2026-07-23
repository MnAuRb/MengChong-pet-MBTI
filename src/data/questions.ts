import type { Question } from "@/types";

export const questions: Question[] = [
  // ===== EI 维度：社交型(E) vs 独立型(I) =====
  {
    id: 1,
    dimension: "EI",
    text: "陌生人来家里做客，你的毛孩子通常会？",
    options: [
      { text: "🐕 主动凑过去嗅嗅、求摸摸", pole: "E" },
      { text: "🐱 躲起来暗中观察，等人走了再出来", pole: "I" },
    ],
  },
  {
    id: 2,
    dimension: "EI",
    text: "带TA去宠物公园，TA的反应是？",
    options: [
      { text: "🎉 冲向其他小伙伴，一秒交到朋友", pole: "E" },
      { text: "💼 紧紧跟在主人身边，做独行侠", pole: "I" },
    ],
  },
  {
    id: 3,
    dimension: "EI",
    text: "主人和朋友视频聊天时，TA会？",
    options: [
      { text: "📸 凑到屏幕前抢镜，存在感拉满", pole: "E" },
      { text: "😴 在旁边安静趴着，岁月静好", pole: "I" },
    ],
  },
  {
    id: 4,
    dimension: "EI",
    text: "家里来了新的宠物伙伴，TA会？",
    options: [
      { text: "🤝 兴奋地迎上去打招呼，热情好客", pole: "E" },
      { text: "👀 保持距离默默观察，谨慎外交", pole: "I" },
    ],
  },
  {
    id: 5,
    dimension: "EI",
    text: "出门遛弯遇见别人家的宠物，TA？",
    options: [
      { text: "🐾 摇着尾巴主动靠近，社交达人", pole: "E" },
      { text: "🏃 绕道走，或者躲在主人身后", pole: "I" },
    ],
  },

  // ===== SN 维度：接地气(S) vs 好奇心(N) =====
  {
    id: 6,
    dimension: "SN",
    text: "给TA一个新玩具，TA会？",
    options: [
      { text: "⚡ 直接扑上去就是一顿操作", pole: "S" },
      { text: "🔍 先围着转几圈，研究明白了再玩", pole: "N" },
    ],
  },
  {
    id: 7,
    dimension: "SN",
    text: "发现了一个空纸箱，TA会？",
    options: [
      { text: "📦 二话不说直接钻进去，先爽了再说", pole: "S" },
      { text: "🧐 绕三圈、闻五遍，评估完再行动", pole: "N" },
    ],
  },
  {
    id: 8,
    dimension: "SN",
    text: "主人换了个新发型回家，TA？",
    options: [
      { text: "👃 立刻凑过来闻，察觉到了变化", pole: "S" },
      { text: "😶 毫无反应，反正闻起来还是你", pole: "N" },
    ],
  },
  {
    id: 9,
    dimension: "SN",
    text: "TA吃饭时的状态是？",
    options: [
      { text: "🍽️ 埋头专注干饭，一气呵成光盘行动", pole: "S" },
      { text: "🎪 吃两口溜达一圈回来再吃，主打随性", pole: "N" },
    ],
  },
  {
    id: 10,
    dimension: "SN",
    text: "窗外传来鸟叫声，TA会？",
    options: [
      { text: "👂 竖起耳朵仔细定位声音来源", pole: "S" },
      { text: "🗣️ 发出奇怪的捕猎叫声，幻想自己在狩猎", pole: "N" },
    ],
  },

  // ===== TF 维度：讲道理(T) vs 情绪化(F) =====
  {
    id: 11,
    dimension: "TF",
    text: "主人心情不好在沙发上叹气，TA会？",
    options: [
      { text: "😎 一切照旧，该干嘛干嘛", pole: "T" },
      { text: "💕 安静靠近，用脑袋蹭蹭表示安慰", pole: "F" },
    ],
  },
  {
    id: 12,
    dimension: "TF",
    text: "TA不小心打碎了一个杯子，会？",
    options: [
      { text: "😏 装作什么都没发生，淡定走开", pole: "T" },
      { text: "🥺 耳朵耷拉下来，露出愧疚的小眼神", pole: "F" },
    ],
  },
  {
    id: 13,
    dimension: "TF",
    text: "你在TA面前假装哭泣，TA？",
    options: [
      { text: "🤨 歪着头疑惑地看着你，不明所以", pole: "T" },
      { text: "😢 着急地舔你的手，慌乱地安慰你", pole: "F" },
    ],
  },
  {
    id: 14,
    dimension: "TF",
    text: "该出门散步了但外面突然下大雨，TA？",
    options: [
      { text: "🚪 雷打不动守在门口，风雨无阻", pole: "T" },
      { text: "🪟 委屈巴巴趴在窗边，生无可恋", pole: "F" },
    ],
  },
  {
    id: 15,
    dimension: "TF",
    text: "家里多了一个小婴儿，TA的表现是？",
    options: [
      { text: "🤷 和平常一样，事不关己", pole: "T" },
      { text: "👶 变得格外温柔小心，默默守护", pole: "F" },
    ],
  },

  // ===== JP 维度：有条理(J) vs 随性子(P) =====
  {
    id: 16,
    dimension: "JP",
    text: "到了每天吃饭的时间，TA会？",
    options: [
      { text: "⏰ 准时蹲在碗边，用眼神提醒你该投喂了", pole: "J" },
      { text: "🍽️ 饿了才慢悠悠晃去碗边看看有没有饭", pole: "P" },
    ],
  },
  {
    id: 17,
    dimension: "JP",
    text: "TA的睡觉地点？",
    options: [
      { text: "🛏️ 有固定的专属位置，从不乱睡", pole: "J" },
      { text: "🎲 随心所欲，今天沙发明天地板后天衣柜", pole: "P" },
    ],
  },
  {
    id: 18,
    dimension: "JP",
    text: "主人拿出行李箱开始收拾东西，TA会？",
    options: [
      { text: "😰 焦虑地绕箱子转圈，知道主人要出门了", pole: "J" },
      { text: "🧳 开心地跳进行李箱，以为是个新窝", pole: "P" },
    ],
  },
  {
    id: 19,
    dimension: "JP",
    text: "早上叫主人起床这件事？",
    options: [
      { text: "⏰ 每天准时来叫，比闹钟还靠谱", pole: "J" },
      { text: "🎰 完全看心情，想叫就叫不想叫自己睡", pole: "P" },
    ],
  },
  {
    id: 20,
    dimension: "JP",
    text: "关于家里的规矩（不上沙发/不进卧室），TA？",
    options: [
      { text: "✅ 严格遵守，自制力满分的好孩子", pole: "J" },
      { text: "😈 趁主人不在偷偷破戒，及时行乐", pole: "P" },
    ],
  },
];
