import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * DrNote schema - exams and users synced with Clerk.
 * See https://docs.convex.dev/database/schemas
 */
export default defineSchema({
  exams: defineTable({
    name: v.string(),
    slug: v.string(),
    questions: v.number(),
    color: v.string(),
    subjects: v.array(v.string()),
    tags: v.array(v.string()),
    description: v.string(),
    passRate: v.number(),
    duration: v.string(),
    difficulty: v.string(),
  }).index("by_slug", ["slug"]),

  users: defineTable({
    name: v.string(),
    externalId: v.string(), // Clerk user ID
    email: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  }).index("by_external_id", ["externalId"]),

  suggestedExams: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    submittedBy: v.optional(v.string()), // Clerk user ID if signed in
  }),
});
