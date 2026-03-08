"use client";

import { Input } from "@/components/ui/input";

interface FilterPill {
  value: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

interface ExamTabHeaderProps {
  /** Main title - omit to hide header text */
  title?: string;
  /** Subtitle below title - omit to hide */
  subtitle?: string;
  /** Section + exam name shown above title - omit to hide */
  aboveTitle?: { section: string; examName: string };
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
  aboveTitle,
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
  const hasHeaderText = aboveTitle || (title && title.trim()) || (subtitle && subtitle.trim());

  return (
    <div className="sticky top-0 z-20 bg-background">
      <div className={`max-w-3xl mx-auto px-3 sm:px-4 text-center ${hasHeaderText ? "py-3 sm:py-4" : "pt-2 pb-2 sm:pt-3 sm:pb-3"}`}>
        {aboveTitle && (
          <p className="mb-1.5 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.12em] text-warm-500/90">
            <span className="text-warm-600 font-medium">{aboveTitle.section}</span>
            <span className="mx-2 text-warm-400/80 font-normal">·</span>
            <span className="text-warm-700">{aboveTitle.examName}</span>
          </p>
        )}
        {title && title.trim() ? (
          <h1
            className="text-lg sm:text-2xl font-bold tracking-tight text-warm-900"
            style={{ fontFamily: "var(--font-serif)", letterSpacing: "-0.02em" }}
          >
            {title}
          </h1>
        ) : null}
        {subtitle && subtitle.trim() ? (
          <p className="text-warm-500 mt-0.5 text-xs sm:text-sm">{subtitle}</p>
        ) : null}

        {/* Filter Pills or Sort Tabs - horizontal scroll on mobile to prevent wrapping */}
        {(filterPills?.length || sortTabs?.length) ? (
          <div className={`flex justify-center ${hasHeaderText ? "mt-3 sm:mt-4" : ""}`}>
            <div className="relative w-full max-w-3xl -mx-3 px-3 sm:mx-0 sm:px-0">
              <div className="flex gap-2 sm:gap-2.5 overflow-x-auto scrollbar-hide pb-1 sm:pb-0 sm:flex-wrap sm:justify-center justify-start">
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
            </div>
          </div>
        ) : null}

        {/* Search Bar - taller on mobile for touch */}
        {searchPlaceholder && onSearchChange ? (
          <div className={`max-w-md mx-auto px-2 sm:px-0 ${(filterPills?.length || sortTabs?.length || hasHeaderText) ? "mt-2 sm:mt-3" : ""}`}>
            <div className="relative">
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
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-8 sm:pl-9 pr-3 min-h-[44px] sm:min-h-0 h-9 sm:h-9 rounded-full border-2 border-warm-300 bg-card focus-visible:border-warm-500 focus-visible:ring-warm-500/20 text-warm-900 placeholder:text-warm-400 text-sm"
              />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
