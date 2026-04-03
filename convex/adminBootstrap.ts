import { mutation } from "./_generated/server";
import { DEFAULT_ADMIN_TASKS } from "./adminTasks";
import { EXAMS } from "./examsCatalog";

/**
 * One-shot setup: seed `exams` if empty, seed `adminTasks` if empty.
 * Run after deploy: `npx convex run adminBootstrap:bootstrap`
 * Or use the button in the control-center Content tab.
 */
export const bootstrap = mutation({
  args: {},
  handler: async (ctx) => {
    let examsSeeded = 0;
    const examFirst = await ctx.db.query("exams").first();
    if (!examFirst) {
      for (const exam of EXAMS) {
        await ctx.db.insert("exams", exam);
        examsSeeded += 1;
      }
    }

    let tasksSeeded = 0;
    const taskFirst = await ctx.db.query("adminTasks").first();
    if (!taskFirst) {
      const now = Date.now();
      for (let i = 0; i < DEFAULT_ADMIN_TASKS.length; i++) {
        const t = DEFAULT_ADMIN_TASKS[i];
        await ctx.db.insert("adminTasks", {
          title: t.title,
          stage: t.stage,
          priority: t.priority,
          type: t.type,
          createdAt: now + i,
        });
        tasksSeeded += 1;
      }
    }

    return {
      examsSeeded,
      tasksSeeded,
      message:
        examsSeeded === 0 && tasksSeeded === 0
          ? "Already seeded (exams and tasks present)."
          : `Seeded ${examsSeeded} exam(s), ${tasksSeeded} task(s).`,
    };
  },
});
