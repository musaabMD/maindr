import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const EXAMS = [
  {
    name: "SMLE",
    slug: "smle",
    questions: 200,
    color: "#006450",
    subjects: ["Medicine", "Clinical Sciences", "Basic Sciences"],
    tags: ["medical", "licensing"],
    description:
      "Saudi Medical License Examination for medical practice licensing.",
    passRate: 65,
    duration: "4h",
    difficulty: "Hard",
  },
  {
    name: "SDLE",
    slug: "sdle",
    questions: 200,
    color: "#1e5a8e",
    subjects: ["Dental Sciences", "Clinical Dentistry", "Basic Sciences"],
    tags: ["dental", "licensing"],
    description:
      "Saudi Dental License Examination for dental practice licensing.",
    passRate: 62,
    duration: "4h",
    difficulty: "Hard",
  },
  {
    name: "SPLE",
    slug: "sple",
    questions: 200,
    color: "#7d3cca",
    subjects: ["Pharmacy", "Clinical Pharmacy", "Pharmaceutical Sciences"],
    tags: ["pharmacy", "licensing"],
    description:
      "Saudi Pharmacy License Examination for pharmacy practice licensing.",
    passRate: 60,
    duration: "4h",
    difficulty: "Hard",
  },
  {
    name: "SNLE",
    slug: "snle",
    questions: 200,
    color: "#e8114b",
    subjects: ["Nursing", "Clinical Nursing", "Patient Care"],
    tags: ["nursing", "licensing"],
    description:
      "Saudi Nursing License Examination for nursing practice licensing.",
    passRate: 68,
    duration: "4h",
    difficulty: "Medium",
  },
  {
    name: "Family Medicine",
    slug: "family-medicine",
    questions: 250,
    color: "#3d6b21",
    subjects: ["Family Medicine", "Primary Care", "Preventive Medicine"],
    tags: ["medical", "family medicine", "specialty"],
    description:
      "Family Medicine specialty examination for board certification.",
    passRate: 58,
    duration: "5h",
    difficulty: "Hard",
  },
  {
    name: "SLLE",
    slug: "slle",
    questions: 200,
    color: "#1f3264",
    subjects: ["Law", "Legal Practice", "Regulations"],
    tags: ["law", "licensing"],
    description:
      "Saudi Law License Examination for legal practice licensing.",
    passRate: 55,
    duration: "4h",
    difficulty: "Hard",
  },
];

/** List all exams */
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("exams").collect();
  },
});

/** Get a single exam by slug */
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    return await ctx.db
      .query("exams")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
  },
});

/** Seed exams (run once: npx convex run exams:seed) */
export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("exams").first();
    if (existing) {
      return { message: "Exams already seeded", count: 0 };
    }
    for (const exam of EXAMS) {
      await ctx.db.insert("exams", exam);
    }
    return { message: "Seeded exams", count: EXAMS.length };
  },
});
