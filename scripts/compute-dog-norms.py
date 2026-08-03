"""
Compute dog MBTI norm parameters from the Italian C-BARQ dataset (n=806).

Reads Dataset_CBARQ.xlsx, computes weighted raw scores for each C-BARQ factor
using the 25 selected items and their factor loadings, then outputs
μ (mean) and σ (stdDev) for each factor as a TypeScript file.

Usage: python scripts/compute-dog-norms.py
"""

import openpyxl
import json
import math
import sys
import re
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')

# ── Load items.json to know which items belong to which factor ──────────
items_path = Path(__file__).parent.parent / "src" / "data" / "dog-quiz" / "items.json"
with open(items_path, "r", encoding="utf-8") as f:
    items = json.load(f)

# ── Factor definitions: factor → {items: [item_ids], loadings: {id: loading}}
factor_items = {}     # factor → list of item ids
factor_loadings = {}  # (factor, item_id) → loading
item_directions = {}  # (factor, item_id) → "+" or "-"

for item in items:
    fid = item["cbarqFactor"]
    iid = item["id"]
    if fid not in factor_items:
        factor_items[fid] = []
    factor_items[fid].append(iid)
    factor_loadings[(fid, iid)] = item["loading"]
    item_directions[(fid, iid)] = item["direction"]

print("Factors:", sorted(factor_items.keys()))
for fid in sorted(factor_items.keys()):
    print(f"  {fid}: items {factor_items[fid]}")

# ── Load Excel ────────────────────────────────────────────────────────
data_path = Path(__file__).parent.parent / "docs" / "dogs_arg" / "Dataset_CBARQ.xlsx"
wb = openpyxl.load_workbook(data_path, data_only=True)
ws = wb.active

# Build column index: item_id → column number (1-indexed)
# Headers are like "@1.Quando..." - extract the number after @
col_map = {}  # item_id → col (1-indexed)
for c in range(1, ws.max_column + 1):
    h = str(ws.cell(1, c).value) if ws.cell(1, c).value else ""
    m = re.match(r'@(\d+)\.', h)
    if m:
        num = int(m.group(1))
        # For duplicate item numbers (item 74), prefer the second occurrence
        # (squirrels/rabbits, has the higher loading 0.895)
        # The first occurrence is cats (loading 0.750)
        if num in col_map:
            # Already seen - this is the duplicate. Check which one we need.
            # Our item 74 has loading 0.895 (squirrels) - use the second occurrence
            pass  # always overwrite with later occurrence
        col_map[num] = c

print(f"\nFound {len(col_map)} item columns in Excel")
print(f"Item 74 column: {col_map.get(74, 'NOT FOUND')}")

# ── Compute raw scores for each dog ────────────────────────────────────
# For each dog: factor → rawScore
all_factor_scores = {fid: [] for fid in factor_items}

skipped = 0
for r in range(2, ws.max_row + 1):
    dog_scores = {}
    has_valid_data = False

    for fid, iids in factor_items.items():
        raw = 0.0
        all_present = True
        for iid in iids:
            col = col_map.get(iid)
            if col is None:
                all_present = False
                break

            v = ws.cell(r, col).value
            # Skip missing/not-observed codes (803, 999) and non-numeric values
            if v is None or not isinstance(v, (int, float)):
                all_present = False
                break
            vi = int(v)
            if vi == 803 or vi == 999:
                all_present = False
                break

            direction = item_directions.get((fid, iid), "+")
            loading = factor_loadings[(fid, iid)]

            # Apply reversal for negative-direction items
            if direction == "-":
                adjusted = 4 - vi  # C-BARQ scale reversal (0-4)
            else:
                adjusted = vi

            raw += loading * adjusted

        if all_present:
            dog_scores[fid] = raw
            has_valid_data = True

    if has_valid_data:
        for fid in factor_items:
            if fid in dog_scores:
                all_factor_scores[fid].append(dog_scores[fid])

# ── Compute statistics ────────────────────────────────────────────────
print(f"\nValid dogs per factor:")
norm_params = {}
for fid in sorted(factor_items.keys()):
    scores = all_factor_scores[fid]
    n = len(scores)
    if n < 2:
        print(f"  {fid}: {n} dogs — SKIPPED (insufficient data)")
        continue
    mean = sum(scores) / n
    variance = sum((s - mean) ** 2 for s in scores) / n
    std_dev = math.sqrt(variance)
    norm_params[fid] = {"mean": round(mean, 6), "stdDev": round(std_dev, 6)}
    print(f"  {fid}: n={n}, μ={mean:.4f}, σ={std_dev:.4f}")

# ── Output TypeScript ──────────────────────────────────────────────────
output_path = Path(__file__).parent.parent / "src" / "lib" / "dog-quiz" / "norm-params.ts"
output_dir = output_path.parent
output_dir.mkdir(parents=True, exist_ok=True)

lines = [
    "/**",
    " * Norm parameters for dog MBTI z-score calibration.",
    " *",
    f" * Computed from Dataset_CBARQ.xlsx (Italian C-BARQ validation, n={sum(len(v) for v in all_factor_scores.values()) // len(all_factor_scores) if all_factor_scores else 0}).",
    " *",
    " * Processing steps:",
    " *   1. For each C-BARQ factor, compute weighted raw score:",
    " *      rawScore_f = Σ(loading_i × adjustedScore_i)",
    " *      where adjustedScore = answer_i (positive) or 4 - answer_i (negative for F8 #6)",
    " *   2. Compute μ (mean) and σ (stdDev) across all dogs with complete data.",
    " *",
    " * Generated by: scripts/compute-dog-norms.py",
    " */",
    "",
    "import type { CbarqFactor } from './types';",
    "",
    "export const DOG_NORM_PARAMS: Record<CbarqFactor, { mean: number; stdDev: number }> = {",
]

for fid in sorted(norm_params.keys()):
    p = norm_params[fid]
    lines.append(f"  {fid}: {{ mean: {p['mean']}, stdDev: {p['stdDev']} }},")

lines.append("};")
lines.append("")

with open(output_path, "w", encoding="utf-8") as f:
    f.write("\n".join(lines))

print(f"\n✅ Norm parameters written to: {output_path}")
