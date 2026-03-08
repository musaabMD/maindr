# Seeding Question Bank into Convex

This guide covers how to seed/import your question bank into Convex efficiently, with a "push one button" experience, while avoiding excessive bandwidth and cost.

---

## Recommended: A Seed Mutation Called from a Button

Write a Convex **mutation** (or **action**) that inserts your data, then call it from a button in your UI. Convex batches all inserts in a single transaction, which is efficient.

### 1. Write the seed mutation in Convex

```typescript
// convex/init.ts
import { internalMutation } from "./_generated/server";

const QUESTIONS = [
  { text: "What is 2+2?", answer: "4", topic: "math" },
  { text: "Capital of France?", answer: "Paris", topic: "geography" },
  // ... add all your questions here
];

export default internalMutation({
  args: {},
  handler: async (ctx) => {
    // Avoid re-inserting if data already exists
    const existing = await ctx.db.query("qbank").first();
    if (existing) {
      console.log("Data already seeded, skipping.");
      return;
    }
    for (const question of QUESTIONS) {
      await ctx.db.insert("qbank", question);
    }
    console.log("✅ QBank seeded successfully!");
  },
});
```

Using `internalMutation` prevents any public client from calling it accidentally. See [Seeding Data](https://stack.convex.dev/seeding-data-for-preview-deployments#my-workflow-preference).

### 2. Call it from a button in your UI

```typescript
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

export function SeedButton() {
  const seedData = useMutation(api.init); // or useAction if it's an action

  return (
    <button onClick={() => seedData({})}>
      🌱 Seed QBank
    </button>
  );
}
```

### Key tips to avoid cost/errors

- **Check before inserting** — The `if (existing) return;` guard makes it safe to press the button multiple times without duplicating data or wasting bandwidth. See [Seeding Data](https://stack.convex.dev/seeding-data-for-preview-deployments#3-seeding-data-in-code).
- **Batch in a single mutation** — All inserts in one mutation run as a single transaction, which is efficient. See [Writing Data](https://docs.convex.dev/database/writing-data#bulk-inserts-or-updates).
- **Keep your data in code** — Storing questions as a TypeScript array in `convex/init.ts` means it's type-checked against your schema, so you won't accidentally insert malformed data.
- **Large datasets** — If you have thousands of questions, split them into batches of ~100 and call the mutation multiple times from an **action**, since mutations have limits (~16k operations). See [MongoDB Migration](https://stack.convex.dev/mongodb-to-convex-a-step-by-step-data-migration-script).

---

## Alternative Strategies for Adding Content

### 1. Use Bulk Import via CLI

Instead of inserting documents one by one through mutations (which each count as function calls), use the `npx convex import` command to load data in bulk from a file:

```bash
# Import from a JSONL file
npx convex import --table qbank questions.jsonl

# Or from a CSV
npx convex import --table qbank questions.csv
```

This is much more efficient than running many individual mutations. See [Data Import](https://docs.convex.dev/database/import-export/import).

### 2. Use Bulk Inserts in a Single Mutation

If you prefer to insert programmatically, do it in a **single mutation** using a loop. Convex queues all changes and executes them in one transaction:

```typescript
export const bulkInsertQuestions = mutation({
  args: {
    questions: v.array(v.object({
      text: v.string(),
      answer: v.string(),
      topic: v.string(),
    })),
  },
  handler: async (ctx, args) => {
    for (const question of args.questions) {
      await ctx.db.insert("qbank", question);
    }
  },
});
```

See [Writing Data](https://docs.convex.dev/database/writing-data#bulk-inserts-or-updates).

### 3. Use Indexes Wisely to Reduce Read Bandwidth

Once your data is in, **define indexes** on the fields you query most (e.g., topic, difficulty). Without indexes, queries do full table scans, which consume a lot of database bandwidth. Keep indexes to a minimum (Convex has a limit of 32 per table) since each index adds maintenance cost on every write. See [Indexes and Query Perf](https://docs.convex.dev/database/reading-data/indexes/indexes-and-query-perf#backfilling-and-maintaining-indexes).

### 4. Avoid Filtering After `.collect()`

Don't fetch all documents and filter in JavaScript — this charges you for every document read. Use indexed queries to fetch only what you need.

### 5. Use Pagination for Large Tables

If you must scan a large table, use pagination to avoid hitting query limits and to spread the read cost over time. See [Complex Filters](https://stack.convex.dev/complex-filters-in-convex#escape-hatch-pagination).

---

## Summary

| Approach | Best for |
|---------|----------|
| `npx convex import` | Bulk-loading from a file (most cost-effective) |
| Single mutation with loop | Programmatic inserts, small–medium datasets |
| Batched mutations from action | Very large datasets (thousands of questions) |

Then use proper indexes to keep read costs low during queries.
