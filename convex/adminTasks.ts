import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { taskPriorityValidator, taskStageValidator, taskTypeValidator } from "./adminValidators";

/** Default board — inserted once by `adminBootstrap:bootstrap` when `adminTasks` is empty */
export const DEFAULT_ADMIN_TASKS = [
  { title: "Set up onboarding flow", stage: "Backlog", priority: "Medium", type: "Dev" },
  { title: "Design exam moderation policy", stage: "Todo", priority: "High", type: "Content" },
  { title: "Import cardiology exam set", stage: "In Progress", priority: "High", type: "Automation" },
  { title: "Review analytics filters", stage: "Review", priority: "Medium", type: "AI" },
  { title: "Deploy admin v1", stage: "Done", priority: "Low", type: "Dev" },
  { title: "Draft radiology mock test", stage: "Todo", priority: "Low", type: "Content" },
  { title: "QA exam timing rules", stage: "In Progress", priority: "Medium", type: "Bug Fix" },
] as const;

export const list = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("adminTasks").collect();
    return rows.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    stage: taskStageValidator,
    priority: taskPriorityValidator,
    type: taskTypeValidator,
  },
  handler: async (ctx, args) => {
    const title = args.title.trim();
    if (!title) {
      throw new Error("Title required");
    }
    return await ctx.db.insert("adminTasks", {
      title,
      stage: args.stage,
      priority: args.priority,
      type: args.type,
      createdAt: Date.now(),
    });
  },
});

/** Insert many tasks in one mutation (e.g. initial seed) */
export const createBatch = mutation({
  args: {
    tasks: v.array(
      v.object({
        title: v.string(),
        stage: taskStageValidator,
        priority: taskPriorityValidator,
        type: taskTypeValidator,
      })
    ),
  },
  handler: async (ctx, { tasks }) => {
    const now = Date.now();
    let n = 0;
    for (const t of tasks) {
      const title = t.title.trim();
      if (!title) continue;
      await ctx.db.insert("adminTasks", {
        title,
        stage: t.stage,
        priority: t.priority,
        type: t.type,
        createdAt: now + n,
      });
      n += 1;
    }
    return { inserted: n };
  },
});

export const updateStage = mutation({
  args: {
    id: v.id("adminTasks"),
    stage: taskStageValidator,
  },
  handler: async (ctx, { id, stage }) => {
    await ctx.db.patch(id, { stage });
  },
});
