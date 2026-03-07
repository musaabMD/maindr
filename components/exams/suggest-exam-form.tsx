"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { useTheme } from "./theme";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface SuggestExamFormProps {
  open: boolean;
  onClose: () => void;
  dark: boolean;
}

export function SuggestExamForm({ open, onClose, dark }: SuggestExamFormProps) {
  const t = useTheme(dark);
  const { user } = useUser();
  const suggest = useMutation(api.suggestedExams.suggest);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      await suggest({
        name: name.trim(),
        description: description.trim() || undefined,
        submittedBy: user?.id,
      });
      setSubmitted(true);
      setName("");
      setDescription("");
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.5)" }}
      />
      <div
        className="relative w-full max-w-md rounded-xl p-6 shadow-xl"
        style={{
          background: dark ? "#1a1a1e" : "#F8F8F7",
          color: t.text,
          border: `1px solid ${t.border}`,
          fontFamily: "var(--font-bricolage)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          className="mb-4 text-lg font-semibold"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Suggest an Exam
        </h2>
        {submitted ? (
          <p style={{ color: t.subtext }}>
            Thanks! Your suggestion has been submitted.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="mb-1.5 block text-sm font-medium"
                style={{ color: t.subtext }}
              >
                Exam name
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Saudi Nursing License Exam"
                required
                className="h-10"
                style={{
                  background: t.inputBg,
                  borderColor: t.border,
                  color: t.text,
                }}
              />
            </div>
            <div>
              <label
                className="mb-1.5 block text-sm font-medium"
                style={{ color: t.subtext }}
              >
                Description (optional)
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Why would this exam be useful?"
                rows={3}
                className="resize-none"
                style={{
                  background: t.inputBg,
                  borderColor: t.border,
                  color: t.text,
                }}
              />
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                style={{ color: t.subtext }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Submitting…" : "Submit"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
