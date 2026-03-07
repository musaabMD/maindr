/**
 * Static exam metadata for SEO and generateStaticParams.
 * Kept in sync with convex/exams.ts EXAMS array.
 */
export const EXAM_SLUGS = [
  "smle",
  "sdle",
  "sple",
  "snle",
  "family-medicine",
  "slle",
] as const;

export type ExamSlug = (typeof EXAM_SLUGS)[number];

export const EXAM_META: Record<
  ExamSlug,
  {
    name: string;
    description: string;
    subjects: string[];
    tags: string[];
    passRate: number;
    duration: string;
    difficulty: string;
    questions: number;
  }
> = {
  smle: {
    name: "SMLE",
    description:
      "Saudi Medical License Examination for medical practice licensing.",
    subjects: ["Medicine", "Clinical Sciences", "Basic Sciences"],
    tags: ["medical", "licensing"],
    passRate: 65,
    duration: "4h",
    difficulty: "Hard",
    questions: 200,
  },
  sdle: {
    name: "SDLE",
    description:
      "Saudi Dental License Examination for dental practice licensing.",
    subjects: ["Dental Sciences", "Clinical Dentistry", "Basic Sciences"],
    tags: ["dental", "licensing"],
    passRate: 62,
    duration: "4h",
    difficulty: "Hard",
    questions: 200,
  },
  sple: {
    name: "SPLE",
    description:
      "Saudi Pharmacy License Examination for pharmacy practice licensing.",
    subjects: ["Pharmacy", "Clinical Pharmacy", "Pharmaceutical Sciences"],
    tags: ["pharmacy", "licensing"],
    passRate: 60,
    duration: "4h",
    difficulty: "Hard",
    questions: 200,
  },
  snle: {
    name: "SNLE",
    description:
      "Saudi Nursing License Examination for nursing practice licensing.",
    subjects: ["Nursing", "Clinical Nursing", "Patient Care"],
    tags: ["nursing", "licensing"],
    passRate: 68,
    duration: "4h",
    difficulty: "Medium",
    questions: 200,
  },
  "family-medicine": {
    name: "Family Medicine",
    description:
      "Family Medicine specialty examination for board certification.",
    subjects: ["Family Medicine", "Primary Care", "Preventive Medicine"],
    tags: ["medical", "family medicine", "specialty"],
    passRate: 58,
    duration: "5h",
    difficulty: "Hard",
    questions: 250,
  },
  slle: {
    name: "SLLE",
    description:
      "Saudi Law License Examination for legal practice licensing.",
    subjects: ["Law", "Legal Practice", "Regulations"],
    tags: ["law", "licensing"],
    passRate: 55,
    duration: "4h",
    difficulty: "Hard",
    questions: 200,
  },
};

export function getExamMeta(slug: string) {
  if (EXAM_SLUGS.includes(slug as ExamSlug)) {
    return EXAM_META[slug as ExamSlug];
  }
  return null;
}
