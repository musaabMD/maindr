"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

type ZenQuote = { q: string; a: string };

const FALLBACK_QUOTES: ZenQuote[] = [
  { q: "The expert in anything was once a beginner.", a: "Helen Hayes" },
  { q: "Success is the sum of small efforts repeated day in and day out.", a: "Robert Collier" },
  { q: "The only way to do great work is to love what you do.", a: "Steve Jobs" },
  { q: "Learning is not attained by chance, it must be sought for with ardor.", a: "Abigail Adams" },
  { q: "The beautiful thing about learning is that nobody can take it away from you.", a: "B.B. King" },
];

interface StudyQuoteProps {
  /** When true, renders as plain blockquote without card/border */
  inline?: boolean;
}

export function StudyQuote({ inline }: StudyQuoteProps) {
  const [quote, setQuote] = useState<ZenQuote | null>(null);

  useEffect(() => {
    setQuote(FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)]);
  }, []);

  if (!quote) return null;

  const content = (
    <blockquote className="italic">
      <p className="text-xl sm:text-2xl leading-relaxed mb-3 text-foreground">
        &ldquo;{quote.q}&rdquo;
      </p>
      <cite className="text-base not-italic text-muted-foreground">
        — {quote.a}
      </cite>
    </blockquote>
  );

  if (inline) {
    return <div className="mb-6">{content}</div>;
  }

  return (
    <Card className="border-l-4 border-l-primary bg-card">
      <CardContent className="pt-6 pb-6">
        {content}
      </CardContent>
    </Card>
  );
}
