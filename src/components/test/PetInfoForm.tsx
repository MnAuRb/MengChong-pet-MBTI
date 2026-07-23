"use client";

import { useState, type FormEvent } from "react";
import { usePetContext } from "@/contexts/PetContext";
import type { PetInfo } from "@/types";

const PET_TYPES = [
  { value: "cat" as const, label: "🐱 猫", emoji: "🐱" },
  { value: "dog" as const, label: "🐕 狗", emoji: "🐕" },
  { value: "other" as const, label: "🐹 其他", emoji: "🐹" },
];

// 年龄选项
const YEARS = Array.from({ length: 21 }, (_, i) => i); // 0-20
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1); // 1-12

interface Props {
  onNext: () => void;
}

export default function PetInfoForm({ onNext }: Props) {
  const { setPetInfo } = usePetContext();
  const [name, setName] = useState("");
  const [petType, setPetType] = useState<PetInfo["type"] | null>(null);
  const [ageYears, setAgeYears] = useState<number | null>(null);
  const [ageMonths, setAgeMonths] = useState<number | null>(null);
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent) {
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

    // 格式化年龄
    let age: string | undefined;
    if (ageYears !== null && ageMonths !== null) {
      age = `${ageYears}年${ageMonths}个月`;
    } else if (ageYears !== null) {
      age = `${ageYears}年`;
    } else if (ageMonths !== null) {
      age = `${ageMonths}个月`;
    }

    setPetInfo({
      name: name.trim(),
      type: petType,
      age,
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
        <div className="grid grid-cols-3 gap-3">
          {PET_TYPES.map((pt) => (
            <button
              key={pt.value}
              type="button"
              onClick={() => setPetType(pt.value)}
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

      {/* 年龄（选填） */}
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-warm-dark">
          年龄 <span className="text-warm-300 font-normal">（选填）</span>
        </span>
        <div className="flex items-center gap-2">
          <select
            id="pet-age-year"
            value={ageYears ?? ""}
            onChange={(e) =>
              setAgeYears(e.target.value ? Number(e.target.value) : null)
            }
            className="flex-1 px-4 py-3 rounded-card border border-warm-200
                       bg-white text-warm-dark min-h-[44px]
                       focus:outline-none focus:border-warm focus:ring-2 focus:ring-warm/20
                       transition-colors"
          >
            <option value="">选择年</option>
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y}年
              </option>
            ))}
          </select>
          <select
            id="pet-age-month"
            value={ageMonths ?? ""}
            onChange={(e) =>
              setAgeMonths(e.target.value ? Number(e.target.value) : null)
            }
            className="flex-1 px-4 py-3 rounded-card border border-warm-200
                       bg-white text-warm-dark min-h-[44px]
                       focus:outline-none focus:border-warm focus:ring-2 focus:ring-warm/20
                       transition-colors"
          >
            <option value="">选择月</option>
            {MONTHS.map((m) => (
              <option key={m} value={m}>
                {m}个月
              </option>
            ))}
          </select>
        </div>
      </div>

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
