"use client";

import { useMemo } from "react";
import { useParams, usePathname } from "next/navigation";
import { ExamHeader } from "@/components/exams/exam-header";
import { ExamAppSidebar } from "@/components/exams/exam-app-sidebar";
import { useTheme } from "@/components/exams/theme";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { getExamMeta } from "@/lib/exam-seo";
import { ExamLayoutProvider, useExamLayout } from "@/components/exams/exam-layout-context";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const PAGE_TITLES: Record<string, string> = {
  questions: "Practice Questions",
  study: "Study",
  review: "Review",
  "self-assessments": "Self Assessments",
  stats: "Stats",
};

function getPageTitle(pathname: string): string | undefined {
  const segments = pathname.split("/").filter(Boolean);
  const examsIdx = segments.indexOf("exams");
  if (examsIdx === -1 || examsIdx + 2 > segments.length) return undefined;
  const pageSegment = segments[examsIdx + 2];
  return PAGE_TITLES[pageSegment];
}

function ExamLayoutInner({ children }: { children: React.ReactNode }) {
  const { dark, setDark } = useExamLayout();
  const params = useParams();
  const pathname = usePathname() ?? "";
  const slug = params.slug as string;
  const exam = useQuery(api.exams.getBySlug, { slug });
  const meta = getExamMeta(slug);
  const t = useTheme(dark);
  const examName = exam?.name ?? meta?.name ?? slug;
  const pageTitle = useMemo(() => getPageTitle(pathname), [pathname]);

  return (
    <SidebarProvider className={cn(!dark && "exam-inset-shell")}>
      <ExamAppSidebar slug={slug} examName={examName} />
      <SidebarInset>
        <div
          className={`flex flex-col h-[100dvh] md:h-screen overflow-hidden transition-colors duration-300 ${dark ? "dark" : ""}`}
          style={{
            /* Light: white main column + header (Chatbase-style); dark: theme canvas */
            background: dark ? t.bg : "#ffffff",
            color: t.text,
            fontFamily: "var(--font-bricolage)",
          }}
        >
          <div
            className="flex-1 min-h-0 overflow-auto"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <ExamHeader
              dark={dark}
              setDark={setDark}
              examSlug={slug}
              examName={examName}
              pageTitle={pageTitle}
              sidebarOpen={true}
              onSidebarOpenChange={() => {}}
              useShadcnSidebar
            />
            <div className="pt-[var(--header-height)]">{children}</div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function ExamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ExamLayoutProvider>
      <ExamLayoutInner>{children}</ExamLayoutInner>
    </ExamLayoutProvider>
  );
}
