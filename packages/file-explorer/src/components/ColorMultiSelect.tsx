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

  const defaultGradient =
    "#ef4444 0 20%, #3b82f6 20% 40%, #22c55e 40% 60%, #eab308 60% 80%, #6b7280 80% 100%";

  return (
    <div className={cn("flex items-center gap-2.5 px-3 py-1", className)}>
      <Button
        noHover
        tip={isFilterMode ? t("color.showAll") : t("color.clearAll")}
        className={cn(
          "relative h-6 w-6 shrink-0 bg-transparent p-0 transition-all",
          isFilterMode &&
            "rounded-full border border-(--_fe-menu-control-border) ring-1 ring-transparent hover:ring-(--_fe-menu-control-ring)",
          !isFilterMode &&
            "bg-transparent text-(--_fe-menu-control-text) hover:bg-transparent hover:text-(--_fe-menu-control-active)",
        )}
        onClick={handleReset}
      >
        {isFilterMode ? (
          <>
            <span
              className="absolute inset-1 rounded-full"
              style={{ background: `conic-gradient(${defaultGradient})` }}
            />
            {isShowAll && (
              <Check
                size={13}
                strokeWidth={4}
                className="relative text-white drop-shadow-sm"
              />
            )}
          </>
        ) : (
          <Ban
            size={18}
            strokeWidth={2.2}
            className={cn(
              isClear
                ? "text-(--_fe-menu-control-text)"
                : "text-(--_fe-menu-control-active)",
            )}
          />
        )}
      </Button>

      <div className="mx-0.5 h-4 w-px bg-(--_fe-menu-control-divider)" />

      <div className="flex gap-2.5">
        {entries.map(([key, color]) => {
          const isSingleSelected = isFilterMode
            ? selected.includes(key) && !isShowAll
            : selected.includes(key);

          return (
            <Button
              key={key}
              noHover
              className={cn(
                "h-5 w-5 rounded-full p-0 transition-all ring-1 ring-transparent hover:ring-(--_fe-menu-control-ring)",
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
