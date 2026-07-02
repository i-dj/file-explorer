"use client";

import { Ban, Check } from "lucide-react";
import { Button } from "./Button";
import { cn } from "../lib/utils";
import { FILE_CATEGORY_COLORS } from "../constants/colors";
import type { CategoryColor } from "../types";
import { useFileExplorerContext } from "../context";
import { getColorLabel } from "../lib";

interface ColorMultiSelectProps {
  selected: CategoryColor[];
  onChange: (values: CategoryColor[]) => void;
  className?: string;
  mode?: "filter" | "tag";
}

export function ColorMultiSelect({
  selected,
  onChange,
  className,
  mode = "filter",
}: ColorMultiSelectProps) {
  const { t } = useFileExplorerContext();
  const entries = Object.entries(FILE_CATEGORY_COLORS) as [
    CategoryColor,
    (typeof FILE_CATEGORY_COLORS)["blue"],
  ][];
  const allValues = entries.map(([key]) => key);

  const isFilterMode = mode === "filter";
  const isShowAll = isFilterMode && selected.length === entries.length;
  const isClear = !isFilterMode && selected.length === 0;

  const handleReset = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isFilterMode) {
      if (isShowAll) return;
      onChange(allValues);
      return;
    }

    if (isClear) return;
    onChange([]);
  };

  const toggle = (value: CategoryColor, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const isSelected = selected.includes(value);

    let next: CategoryColor[];

    if (isFilterMode && isShowAll) {
      next = [value];
    } else {
      next = isSelected
        ? selected.filter((v) => v !== value)
        : [...selected, value];

      if (
        isFilterMode &&
        (next.length === 0 || next.length === allValues.length)
      ) {
        next = allValues;
      }
    }

    onChange(next);
  };

  const defaultGradient = "#3b82f6, #ef4444  ";

  return (
    <div className={cn("flex items-center gap-3 px-3 py-2", className)}>
      <Button
        noHover
        tip={isFilterMode ? t("color.showAll") : t("color.clearAll")}
        className={cn(
          "h-5 w-5 shrink-0 p-0 transition-all",
          isFilterMode &&
            "rounded-full border border-[#3a3d44]",
          !isFilterMode &&
            "bg-transparent text-[#a8aaaf] hover:bg-transparent hover:text-white",
        )}
        style={
          isFilterMode
            ? {
                background: `conic-gradient(${defaultGradient})`,
              }
            : undefined
        }
        onClick={handleReset}
      >
        {isFilterMode ? (
          isShowAll && (
            <Check
              size={12}
              strokeWidth={4}
              className="text-white drop-shadow-sm"
            />
          )
        ) : (
          <Ban
            size={18}
            strokeWidth={2.2}
            className={cn(
              isClear ? "text-[#a8aaaf]" : "text-white",
            )}
          />
        )}
      </Button>

      <div className="mx-0.5 h-4 w-px bg-[#4a4d54]" />

      <div className="flex gap-3">
        {entries.map(([key, color]) => {
          const isSingleSelected = isFilterMode
            ? selected.includes(key) && !isShowAll
            : selected.includes(key);

          return (
            <Button
              key={key}
              noHover
              className={cn(
                "h-5 w-5 rounded-full p-0 transition-all ring-1 ring-transparent hover:ring-white/50",
                color.bgClass,
              )}
              onClick={(e) => toggle(key, e)}
              tip={getColorLabel(key, t)}
            >
              {isSingleSelected && (
                <Check size={12} strokeWidth={4} className="text-white" />
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
