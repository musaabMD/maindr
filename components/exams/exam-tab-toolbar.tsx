"use client";

import { Input } from "@/components/ui/input";

interface FilterPill {
  value: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

export interface ExamTabToolbarProps {
  filterPills?: FilterPill[];
  activeFilter?: string;
  onFilterChange?: (value: string) => void;
  sortTabs?: { value: string; label: string }[];
  sortMode?: string;
  onSortChange?: (value: string) => void;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

export function ExamTabToolbar({
  filterPills,
  activeFilter,
  onFilterChange,
  sortTabs,
  sortMode,
  onSortChange,
  searchPlaceholder,
  searchValue = "",
  onSearchChange,
}: ExamTabToolbarProps) {
  const hasFilters = (filterPills?.length ?? 0) > 0 || (sortTabs?.length ?? 0) > 0;
  const hasSearch = Boolean(searchPlaceholder && onSearchChange);

  if (!hasFilters && !hasSearch) return null;

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-4 py-2 sm:py-3">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
        {(filterPills?.length || sortTabs?.length) ? (
          <div className="flex gap-2 sm:gap-2.5 overflow-x-auto scrollbar-hide pb-1 sm:pb-0 shrink-0">
            {filterPills?.map((pill) => {
              const isActive = activeFilter === pill.value;
              return (
                <button
                  key={pill.value}
                  onClick={() => onFilterChange?.(pill.value)}
                  className={`min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 px-3.5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap flex items-center justify-center gap-1.5 shrink-0 ${
                    isActive
                      ? "bg-warm-900 text-white shadow-sm"
                      : "bg-warm-100 text-warm-600 hover:bg-warm-200 border border-warm-200/50"
                  }`}
                >
                  {pill.icon}
                  {pill.label}
                  {pill.count !== undefined && (
                    <span className="ml-1 opacity-70">{pill.count}</span>
                  )}
                </button>
              );
            })}
            {sortTabs?.map((tab) => {
              const isActive = sortMode === tab.value;
              return (
                <button
                  key={tab.value}
                  onClick={() => onSortChange?.(tab.value)}
                  className={`min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 px-3.5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap flex items-center justify-center shrink-0 ${
                    isActive
                      ? "bg-warm-900 text-white shadow-sm"
                      : "bg-warm-100 text-warm-600 hover:bg-warm-200 border border-warm-200/50"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        ) : null}
        {hasSearch ? (
          <div className="relative flex-1 min-w-0 max-w-md sm:max-w-xs">
            <svg
              className="w-4 h-4 text-warm-400 absolute left-3 top-1/2 -translate-y-1/2 z-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full pl-8 sm:pl-9 pr-3 min-h-[44px] sm:min-h-0 h-9 sm:h-9 rounded-full border-2 border-warm-300 bg-card focus-visible:border-warm-500 focus-visible:ring-warm-500/20 text-warm-900 placeholder:text-warm-400 text-sm"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
