"use client";

import { useState } from "react";
import { Clock, Calculator, Zap, XCircle, BookOpen, Pencil, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { MockQuestion } from "@/components/exams/mock-exam";

const DEMO_QUESTION: MockQuestion = {
  id: "demo",
  text: "Female patient with green vaginal discharge, strawberry cervix. Most likely diagnosis?",
  options: [
    { id: "A", text: "Trichomonas" },
    { id: "B", text: "Fungal" },
    { id: "C", text: "Bacterial vaginosis" },
    { id: "D", text: "N. gonorrhoeae" },
  ],
  subject: "Obstetrics",
};

export function TimedQuizWidget() {
  const [minutes, setMinutes] = useState(5);
  return (
    <div className="rounded-xl border-2 border-blue-200 dark:border-blue-800/50 bg-blue-50/50 dark:bg-blue-950/30 p-6 min-h-[180px] flex flex-col justify-between">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/40">
          <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>
        <span className="text-base font-semibold">Timed Quiz</span>
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Input
            type="number"
            min={1}
            max={60}
            value={minutes}
            onChange={(e) =>
              setMinutes(Math.min(60, Math.max(1, Number(e.target.value) || 1)))
            }
            className="w-16 h-10 text-base"
          />
          <span className="text-sm text-muted-foreground">min</span>
          <input
            type="range"
            min={1}
            max={60}
            value={minutes}
            onChange={(e) => setMinutes(Number(e.target.value))}
            className="flex-1 h-2 rounded-full appearance-none bg-muted accent-blue-500"
          />
        </div>
        <Button size="default" className="w-full h-10 text-sm">
          Start Quiz
        </Button>
      </div>
    </div>
  );
}

export function MockExamWidget() {
  const [selected, setSelected] = useState<string | undefined>();
  return (
    <div className="rounded-xl border-2 border-green-200 dark:border-green-800/50 bg-green-50/50 dark:bg-green-950/30 p-6 min-h-[180px] overflow-hidden">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/40">
          <Calculator className="h-5 w-5 text-green-600 dark:text-green-400" />
        </div>
        <span className="text-base font-semibold">Mock Exam</span>
      </div>
      <div className="text-sm text-muted-foreground mb-3 line-clamp-2">
        {DEMO_QUESTION.text}
      </div>
      <div className="flex flex-wrap gap-2">
        {DEMO_QUESTION.options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => setSelected(opt.id)}
            className={`px-3 py-2 rounded-md text-sm border transition-colors ${
              selected === opt.id
                ? "border-green-500 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300"
                : "border-border bg-background hover:bg-muted"
            }`}
          >
            {opt.id}. {opt.text}
          </button>
        ))}
      </div>
    </div>
  );
}

export function QuestionOfDayWidget() {
  const [selected, setSelected] = useState<string | undefined>();
  return (
    <div className="rounded-xl border-2 border-amber-200 dark:border-amber-800/50 bg-amber-50/50 dark:bg-amber-950/30 p-6 min-h-[180px] overflow-hidden">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/40">
          <Zap className="h-5 w-5 text-amber-600 dark:text-amber-400" />
        </div>
        <span className="text-base font-semibold">Question of the Day</span>
      </div>
      <div className="text-sm text-muted-foreground mb-3 line-clamp-2">
        {DEMO_QUESTION.text}
      </div>
      <div className="flex flex-wrap gap-2">
        {DEMO_QUESTION.options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => setSelected(opt.id)}
            className={`px-3 py-2 rounded-md text-sm border transition-colors ${
              selected === opt.id
                ? "border-amber-500 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300"
                : "border-border bg-background hover:bg-muted"
            }`}
          >
            {opt.id}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Quick10Widget() {
  const [count, setCount] = useState(0);
  return (
    <div className="rounded-xl border-2 border-sky-200 dark:border-sky-800/50 bg-sky-50/50 dark:bg-sky-950/30 p-6 min-h-[180px] flex flex-col justify-between">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-sky-100 dark:bg-sky-900/40">
          <Zap className="h-5 w-5 text-sky-600 dark:text-sky-400" />
        </div>
        <span className="text-base font-semibold">Quick 10</span>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold text-sky-600 dark:text-sky-400 mb-3">
          {count}/10
        </div>
        <Button
          size="default"
          variant="outline"
          className="w-full h-10 text-sm"
          onClick={() => setCount((c) => Math.min(10, c + 1))}
        >
          + Answer
        </Button>
      </div>
    </div>
  );
}

export function MissedQuestionsWidget() {
  const incorrectCount = 3;
  return (
    <div className="rounded-xl border-2 border-pink-200 dark:border-pink-800/50 bg-pink-50/50 dark:bg-pink-950/30 p-6 min-h-[180px] flex flex-col justify-between">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-pink-100 dark:bg-pink-900/40">
          <XCircle className="h-5 w-5 text-pink-600 dark:text-pink-400" />
        </div>
        <span className="text-base font-semibold">Missed Questions</span>
      </div>
      <div className="rounded-lg border border-pink-200 dark:border-pink-800/50 bg-pink-100/50 dark:bg-pink-900/20 p-4 text-center">
        <span className="text-3xl font-bold text-pink-700 dark:text-pink-400">
          {incorrectCount}
        </span>
        <span className="text-sm text-muted-foreground block">to review</span>
      </div>
      <Button size="default" variant="outline" className="w-full h-10 text-sm">
        Practice
      </Button>
    </div>
  );
}

export function WeakestSubjectWidget() {
  const subjects = ["Medicine", "OB/GYN", "Surgery"];
  const [selected, setSelected] = useState(subjects[0]);
  return (
    <div className="rounded-xl border-2 border-red-200 dark:border-red-800/50 bg-red-50/50 dark:bg-red-950/30 p-6 min-h-[180px] flex flex-col justify-between">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/40">
          <BookOpen className="h-5 w-5 text-red-600 dark:text-red-400" />
        </div>
        <span className="text-base font-semibold">Weakest Subject</span>
      </div>
      <div className="space-y-2">
        {subjects.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSelected(s)}
            className={`w-full text-left px-3 py-2 rounded-md text-sm ${
              selected === s ? "bg-red-100 dark:bg-red-900/40" : "hover:bg-red-50 dark:hover:bg-red-900/20"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
      <Button size="default" variant="outline" className="w-full h-10 text-sm">
        Start
      </Button>
    </div>
  );
}

export function BuildYourOwnWidget() {
  const subjects = ["Medicine", "OB/GYN", "Surgery"];
  const [checked, setChecked] = useState<Set<string>>(new Set(subjects));
  const toggle = (s: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next;
    });
  };
  return (
    <div className="rounded-xl border-2 border-sky-200 dark:border-sky-800/50 bg-sky-50/50 dark:bg-sky-950/30 p-6 min-h-[180px] flex flex-col justify-between">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-sky-100 dark:bg-sky-900/40">
          <Pencil className="h-5 w-5 text-sky-600 dark:text-sky-400" />
        </div>
        <span className="text-base font-semibold">Build Your Own</span>
      </div>
      <div className="space-y-2">
        {subjects.map((s) => (
          <label key={s} className="flex items-center gap-3 cursor-pointer text-sm">
            <input
              type="checkbox"
              checked={checked.has(s)}
              onChange={() => toggle(s)}
              className="rounded border-input h-4 w-4"
            />
            {s}
          </label>
        ))}
      </div>
      <Button size="default" variant="outline" className="w-full h-10 text-sm">
        Create Quiz
      </Button>
    </div>
  );
}

export function LevelUpWidget() {
  const [level, setLevel] = useState(2);
  return (
    <div className="rounded-xl border-2 border-emerald-200 dark:border-emerald-800/50 bg-emerald-50/50 dark:bg-emerald-950/30 p-6 min-h-[180px] flex flex-col justify-between">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/40">
          <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <span className="text-base font-semibold">Level Up</span>
      </div>
      <div className="text-center">
        <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
          Lv.{level}
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden mb-3">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all"
            style={{ width: `${(level / 5) * 100}%` }}
          />
        </div>
        <Button
          size="default"
          variant="outline"
          className="w-full h-10 text-sm"
          onClick={() => setLevel((l) => Math.min(5, l + 1))}
        >
          + XP
        </Button>
      </div>
    </div>
  );
}
