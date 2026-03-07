"use client";

import { Input } from "@/components/ui/input";

interface FilterPill {
  value: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

interface ExamTabHeaderProps {
  title: string;
  subtitle: string;
  /** Filter pills (e.g. All, Flagged, Incorrect, Correct) */
  filterPills?: FilterPill[];
  activeFilter?: string;
  onFilterChange?: (value: string) => void;
  /** Sort tabs (e.g. By Date, By Subject) - alternative to filter pills */
  sortTabs?: { value: string; label: string }[];
  sortMode?: string;
  onSortChange?: (value: string) => void;
  /** Search */
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

export function ExamTabHeader({
  title,
  subtitle,
  filterPills,
  activeFilter,
  onFilterChange,
  sortTabs,
  sortMode,
  onSortChange,
  searchPlaceholder,
  searchValue = "",
  onSearchChange,
}: ExamTabHeaderProps) {
  return (
    <div className="border-b border-warm-200/60 bg-[#F8F8F7]">
      <div className="max-w-3xl mx-auto px-4 py-6 text-center">
        <h1
          className="text-2xl font-bold tracking-tight text-warm-900"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {title}
        </h1>
        <p className="text-warm-500 mt-1 text-sm">{subtitle}</p>

        {/* Filter Pills or Sort Tabs */}
        {(filterPills?.length || sortTabs?.length) ? (
          <div className="flex justify-center gap-2 mt-5 flex-wrap">
            {filterPills?.map((pill) => {
              const isActive = activeFilter === pill.value;
              return (
                <button
                  key={pill.value}
                  onClick={() => onFilterChange?.(pill.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? "bg-teal-600 text-white"
                      : "bg-warm-100 text-warm-600 hover:bg-warm-200"
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
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-teal-600 text-white"
                      : "bg-warm-100 text-warm-600 hover:bg-warm-200"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        ) : null}

        {/* Search Bar */}
        {searchPlaceholder && onSearchChange ? (
          <div className="mt-5 max-w-md mx-auto">
            <div className="relative">
              <svg
                className="w-5 h-5 text-warm-400 absolute left-3 top-1/2 -translate-y-1/2 z-10"
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
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 h-11 rounded-full border-2 border-warm-300 bg-card focus-visible:border-warm-500 focus-visible:ring-warm-500/20 text-warm-900 placeholder:text-warm-400"
              />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
