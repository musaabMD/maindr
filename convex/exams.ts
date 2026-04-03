import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { EXAMS } from "./examsCatalog";

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

/** Admin: create a minimal exam row (expand in dashboard later) */
export const create = mutation({
  args: {
    name: v.string(),
    slug: v.optional(v.string()),
  },
  handler: async (ctx, { name, slug }) => {
    const trimmed = name.trim();
    if (!trimmed) {
      throw new Error("Name required");
    }
    const base =
      slug?.trim() ||
      trimmed
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    const finalSlug = base || `exam-${Date.now()}`;
    const dup = await ctx.db
      .query("exams")
      .withIndex("by_slug", (q) => q.eq("slug", finalSlug))
      .unique();
    if (dup) {
      throw new Error(`Slug already exists: ${finalSlug}`);
    }
    await ctx.db.insert("exams", {
      name: trimmed,
      slug: finalSlug,
      questions: 0,
      color: "#64748b",
      subjects: [],
      tags: [],
      description: "",
      passRate: 0,
      duration: "—",
      difficulty: "—",
    });
    return finalSlug;
  },
});
