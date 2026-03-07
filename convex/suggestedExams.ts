import { v } from "convex/values";
import { mutation } from "./_generated/server";

/** Submit a suggested exam */
export const suggest = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    submittedBy: v.optional(v.string()),
  },
  handler: async (ctx, { name, description, submittedBy }) => {
    return await ctx.db.insert("suggestedExams", {
      name: name.trim(),
      description: description?.trim() ?? undefined,
      submittedBy,
    });
  },
});
