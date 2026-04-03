import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const uploadItem = v.object({
  examSlug: v.string(),
  examTitle: v.string(),
  source: v.string(),
  name: v.string(),
  size: v.optional(v.number()),
  textPreview: v.optional(v.string()),
  isDuplicate: v.boolean(),
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("adminUploads").collect();
    return rows.sort((a, b) => b.createdAt - a.createdAt);
  },
});

/** Persist many upload rows in one round-trip */
export const addBatch = mutation({
  args: {
    items: v.array(uploadItem),
  },
  handler: async (ctx, { items }) => {
    const now = Date.now();
    let n = 0;
    for (const item of items) {
      await ctx.db.insert("adminUploads", {
        ...item,
        createdAt: now + n,
      });
      n += 1;
    }
    return { inserted: items.length };
  },
});
