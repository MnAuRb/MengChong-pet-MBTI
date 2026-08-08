/** 品种信息：中文显示名 + 文件目录 slug */
export interface BreedInfo {
  /** 中文显示名，如 "金毛"、"英短" */
  name: string;
  /** 文件目录名，如 "golden-retriever"、"british-shorthair" */
  slug: string;
}

// ===== 猫品种（17 种，按首字母排序）=====
export const CAT_BREEDS: BreedInfo[] = [
  { name: "阿比西尼亚", slug: "abyssinian" },
  { name: "波斯猫", slug: "persian" },
  { name: "布偶猫", slug: "ragdoll" },
  { name: "德文卷毛", slug: "devon-rex" },
  { name: "黑猫", slug: "black-cat" },
  { name: "加菲猫", slug: "exotic-shorthair" },
  { name: "金渐层", slug: "golden-shaded" },
  { name: "橘猫", slug: "orange-tabby" },
  { name: "蓝猫", slug: "british-blue" },
  { name: "美短", slug: "american-shorthair" },
  { name: "缅因猫", slug: "maine-coon" },
  { name: "奶牛猫", slug: "tuxedo-cat" },
  { name: "暹罗猫", slug: "siamese" },
  { name: "三花猫", slug: "calico" },
  { name: "银渐层", slug: "silver-shaded" },
  { name: "英短", slug: "british-shorthair" },
  { name: "中华田园猫", slug: "chinese-domestic-cat" },
];

// ===== 狗品种（18 种，按首字母排序）=====
export const DOG_BREEDS: BreedInfo[] = [
  { name: "阿拉斯加", slug: "alaskan-malamute" },
  { name: "比熊", slug: "bichon-frise" },
  { name: "伯恩山", slug: "bernese-mountain-dog" },
  { name: "边牧", slug: "border-collie" },
  { name: "博美", slug: "pomeranian" },
  { name: "柴犬", slug: "shiba-inu" },
  { name: "德牧", slug: "german-shepherd" },
  { name: "法斗", slug: "french-bulldog" },
  { name: "哈士奇", slug: "husky" },
  { name: "吉娃娃", slug: "chihuahua" },
  { name: "金毛", slug: "golden-retriever" },
  { name: "柯基", slug: "corgi" },
  { name: "拉布拉多", slug: "labrador" },
  { name: "萨摩耶", slug: "samoyed" },
  { name: "泰迪/贵宾", slug: "poodle" },
  { name: "雪纳瑞", slug: "schnauzer" },
  { name: "约克夏", slug: "yorkshire-terrier" },
  { name: "中华田园犬", slug: "chinese-rural-dog" },
];
