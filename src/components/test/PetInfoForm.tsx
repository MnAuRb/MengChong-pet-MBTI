"use client";

import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import { usePetContext } from "@/contexts/PetContext";
import { CAT_BREEDS, DOG_BREEDS } from "@/data/breeds";
import type { PetInfo } from "@/types";

const PET_TYPES = [
  { value: "cat" as const, label: "咪咪", emoji: "🐱" },
  { value: "dog" as const, label: "汪汪", emoji: "🐕" },
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

  function handleTypeChange(type: PetInfo["type"]) {
    setPetType(type);
    setBreed("");
    setBreedSearch("");
    setShowDropdown(false);
    setHighlightIdx(-1);
  }

  function getBreeds(): string[] {
    switch (petType) {
      case "cat": return CAT_BREEDS.map((b) => b.name);
      case "dog": return DOG_BREEDS.map((b) => b.name);
      default: return [];
    }
  }

  const filteredBreeds = getBreeds().filter((b) =>
    breedSearch ? b.toLowerCase().includes(breedSearch.toLowerCase()) : true
  );

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
        <h2 className="text-2xl font-normal text-brand-text">
          先介绍一下你的毛孩子
        </h2>
      </div>

      {/* 宠物名字 */}
      <div className="flex flex-col gap-2">
        <label htmlFor="pet-name" className="text-sm font-normal text-brand-muted">
          名字
        </label>
        <input
          id="pet-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="例如：咪咪、旺财"
          maxLength={20}
          className="w-full px-4 py-3 rounded-md border border-brand-border
                     bg-brand-surface text-brand-text placeholder:text-brand-muted
                     focus:outline-none focus:border-brand-focus focus:ring-1 focus:ring-brand-focus/20
                     transition-colors"
        />
      </div>

      {/* 宠物类型 */}
      <div className="flex flex-col gap-2">
        <span className="text-sm font-normal text-brand-muted">类型</span>
        <div className="grid grid-cols-2 gap-3">
          {PET_TYPES.map((pt) => (
            <button
              key={pt.value}
              type="button"
              onClick={() => handleTypeChange(pt.value)}
              className={`flex flex-col items-center gap-1 py-3 px-2 rounded-lg border
                         transition-colors
                         ${petType === pt.value
                           ? "border-brand-primary bg-brand-surface-alt"
                           : "border-brand-border bg-brand-surface hover:border-brand-border-strong"
                         }`}
            >
              <span className="text-2xl">{pt.emoji}</span>
              <span className="text-xs font-normal text-brand-text">{pt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 品种搜索选择 */}
      {petType && (
        <div className="flex flex-col gap-2">
          <span className="text-sm font-normal text-brand-muted">
            品种（按首字母排序）
          </span>

          {breed ? (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-3 py-2 bg-brand-surface-alt
                               text-brand-text text-sm font-normal rounded-lg border border-brand-border">
                {breed}
                <button
                  type="button"
                  onClick={() => setBreed("")}
                  className="ml-1 text-brand-muted hover:text-brand-text transition-colors"
                  aria-label="清除品种"
                >
                  ✕
                </button>
              </span>
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
                className="w-full px-4 py-3 rounded-md border border-brand-border
                           bg-brand-surface text-brand-text placeholder:text-brand-muted
                           focus:outline-none focus:border-brand-focus focus:ring-1 focus:ring-brand-focus/20
                           transition-colors"
              />

              {showDropdown && filteredBreeds.length > 0 && (
                <ul className="absolute z-10 w-full mt-1 bg-brand-surface border border-brand-border
                               rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {filteredBreeds.map((b, idx) => (
                    <li key={b}>
                      <button
                        type="button"
                        onClick={() => selectBreed(b)}
                        className={`w-full text-left px-4 py-2.5 text-sm text-brand-text
                                   transition-colors min-h-[44px]
                                   ${idx === highlightIdx
                                     ? "bg-brand-surface-alt"
                                     : "hover:bg-brand-surface-alt"
                                   }`}
                      >
                        {b}
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {showDropdown && breedSearch && filteredBreeds.length === 0 && (
                <div className="absolute z-10 w-full mt-1 bg-brand-surface border border-brand-border
                                rounded-lg shadow-lg p-4 text-center text-sm text-brand-muted">
                  没有匹配的品种，请从列表中选择
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {!petType && (
        <div className="flex flex-col gap-2 opacity-50">
          <span className="text-sm font-normal text-brand-muted">
            品种
          </span>
          <div className="w-full px-4 py-3 rounded-md border border-brand-border
                          bg-brand-surface-alt text-brand-muted text-sm">
            请先选择宠物类型
          </div>
        </div>
      )}

      {/* 错误提示 */}
      {error && (
        <p className="text-sm text-brand-error text-center">{error}</p>
      )}

      {/* 提交按钮 */}
      <button
        type="submit"
        className="rounded-full bg-brand-primary hover:bg-brand-text text-white
                   text-sm font-medium py-3 px-8 w-full
                   transition-colors"
      >
        开始测试
      </button>
    </form>
  );
}
