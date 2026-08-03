"use client";

import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import { usePetContext } from "@/contexts/PetContext";
import type { PetInfo } from "@/types";

const PET_TYPES = [
  { value: "cat" as const, label: "🐱 猫", emoji: "🐱" },
  { value: "dog" as const, label: "🐕 狗", emoji: "🐕" },
];

// 品种数据
const CAT_BREEDS = [
  "阿比西尼亚",
  "波斯猫",
  "布偶猫",
  "德文卷毛",
  "黑猫",
  "加菲猫",
  "金渐层",
  "橘猫",
  "蓝猫",
  "美短",
  "缅因猫",
  "奶牛猫",
  "暹罗猫",
  "三花猫",
  "银渐层",
  "英短",
  "中华田园猫",
];

const DOG_BREEDS = [
  "阿拉斯加",
  "比熊",
  "边牧",
  "博美",
  "柴犬",
  "德牧",
  "法斗",
  "哈士奇",
  "吉娃娃",
  "金毛",
  "柯基",
  "拉布拉多",
  "萨摩耶",
  "泰迪/贵宾",
  "雪纳瑞",
  "约克夏",
  "中华田园犬",
];

interface Props {
  onNext: () => void;
}

export default function PetInfoForm({ onNext }: Props) {
  const { setPetInfo } = usePetContext();
  const [name, setName] = useState("");
  const [petType, setPetType] = useState<PetInfo["type"] | null>(null);
  const [breed, setBreed] = useState("");
  const [breedSearch, setBreedSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");

  // 当切换宠物类型时，重置品种选择
  function handleTypeChange(type: PetInfo["type"]) {
    setPetType(type);
    setBreed("");
    setBreedSearch("");
    setShowDropdown(false);
    setHighlightIdx(-1);
  }

  // 获取当前类型的品种列表
  function getBreeds(): string[] {
    switch (petType) {
      case "cat": return CAT_BREEDS;
      case "dog": return DOG_BREEDS;
      default: return [];
    }
  }

  // 筛选后的品种
  const filteredBreeds = getBreeds().filter((b) =>
    breedSearch ? b.toLowerCase().includes(breedSearch.toLowerCase()) : true
  );

  // 点击外部关闭下拉
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
        setHighlightIdx(-1);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 键盘导航
  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (!showDropdown || filteredBreeds.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightIdx((prev) =>
          prev < filteredBreeds.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightIdx((prev) =>
          prev > 0 ? prev - 1 : filteredBreeds.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightIdx >= 0 && highlightIdx < filteredBreeds.length) {
          selectBreed(filteredBreeds[highlightIdx]);
        }
        break;
      case "Escape":
        setShowDropdown(false);
        setHighlightIdx(-1);
        break;
    }
  }

  function selectBreed(b: string) {
    setBreed(b);
    setBreedSearch("");
    setShowDropdown(false);
    setHighlightIdx(-1);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("请输入你家毛孩子的名字～");
      return;
    }
    if (!petType) {
      setError("请选择毛孩子的类型～");
      return;
    }
    if (!breed) {
      setError("请选择毛孩子的品种～");
      return;
    }

    setPetInfo({
      name: name.trim(),
      type: petType,
      breed,
    });
    onNext();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
      {/* 标题 */}
      <div className="text-center">
        <h2 className="text-xl font-bold text-warm-dark">
          先介绍一下你的毛孩子 🐾
        </h2>
      </div>

      {/* 宠物名字 */}
      <div className="flex flex-col gap-2">
        <label htmlFor="pet-name" className="text-sm font-medium text-warm-dark">
          名字
        </label>
        <input
          id="pet-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="例如：咪咪、旺财"
          maxLength={20}
          className="w-full px-4 py-3 rounded-card border border-warm-200
                     bg-white text-warm-dark placeholder-warm-300
                     focus:outline-none focus:border-warm focus:ring-2 focus:ring-warm/20
                     transition-colors"
        />
      </div>

      {/* 宠物类型 */}
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-warm-dark">类型</span>
        <div className="grid grid-cols-2 gap-3">
          {PET_TYPES.map((pt) => (
            <button
              key={pt.value}
              type="button"
              onClick={() => handleTypeChange(pt.value)}
              className={`flex flex-col items-center gap-1 py-3 px-2 rounded-card border-2
                         transition-all
                         ${petType === pt.value
                           ? "border-warm bg-warm-light scale-105"
                           : "border-warm-200 bg-white hover:border-warm-300"
                         }`}
            >
              <span className="text-2xl">{pt.emoji}</span>
              <span className="text-xs font-medium text-warm-dark">{pt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 品种搜索选择 */}
      {petType && (
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-warm-dark">
            品种
          </span>

          {/* 已选品种 */}
          {breed ? (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-3 py-2 bg-warm-light
                               text-warm-dark text-sm font-medium rounded-card border border-warm">
                {breed}
                <button
                  type="button"
                  onClick={() => setBreed("")}
                  className="ml-1 text-warm-400 hover:text-warm-dark transition-colors"
                  aria-label="清除品种"
                >
                  ✕
                </button>
              </span>
              <button
                type="button"
                onClick={() => { setShowDropdown(true); inputRef.current?.focus(); }}
                className="text-sm text-warm hover:text-warm-600 underline"
              >
                更换
              </button>
            </div>
          ) : (
            <div ref={dropdownRef} className="relative">
              <input
                ref={inputRef}
                type="text"
                value={breedSearch}
                onChange={(e) => {
                  setBreedSearch(e.target.value);
                  setShowDropdown(true);
                  setHighlightIdx(-1);
                }}
                onFocus={() => setShowDropdown(true)}
                onKeyDown={handleKeyDown}
                placeholder={`搜索${petType === "cat" ? "猫" : "狗"}的品种...`}
                className="w-full px-4 py-3 rounded-card border border-warm-200
                           bg-white text-warm-dark placeholder-warm-300
                           focus:outline-none focus:border-warm focus:ring-2 focus:ring-warm/20
                           transition-colors"
              />

              {/* 下拉选项 */}
              {showDropdown && filteredBreeds.length > 0 && (
                <ul className="absolute z-10 w-full mt-1 bg-white border border-warm-200
                               rounded-card shadow-lg max-h-48 overflow-y-auto">
                  {filteredBreeds.map((b, idx) => (
                    <li key={b}>
                      <button
                        type="button"
                        onClick={() => selectBreed(b)}
                        className={`w-full text-left px-4 py-2.5 text-sm text-warm-dark
                                   transition-colors min-h-[44px]
                                   ${idx === highlightIdx
                                     ? "bg-warm-light"
                                     : "hover:bg-warm-50"
                                   }`}
                      >
                        {b}
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {/* 无匹配结果 */}
              {showDropdown && breedSearch && filteredBreeds.length === 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-warm-200
                                rounded-card shadow-lg p-4 text-center text-sm text-warm-400">
                  没有匹配的品种，请从列表中选择
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {!petType && (
        <div className="flex flex-col gap-2 opacity-50">
          <span className="text-sm font-medium text-warm-dark">
            品种
          </span>
          <div className="w-full px-4 py-3 rounded-card border border-warm-100
                          bg-warm-50/50 text-warm-300 text-sm">
            请先选择宠物类型
          </div>
        </div>
      )}

      {/* 错误提示 */}
      {error && (
        <p className="text-sm text-red-500 text-center">{error}</p>
      )}

      {/* 提交按钮 */}
      <button
        type="submit"
        className="bg-warm hover:bg-warm-600 text-white font-bold
                   py-4 px-8 rounded-button w-full text-lg
                   transition-colors shadow-lg shadow-warm/25"
      >
        🐾 开始测试
      </button>
    </form>
  );
}
