import { v } from "convex/values";

export const taskStageValidator = v.union(
  v.literal("Backlog"),
  v.literal("Todo"),
  v.literal("In Progress"),
  v.literal("Review"),
  v.literal("Done")
);

export const taskPriorityValidator = v.union(v.literal("Low"), v.literal("Medium"), v.literal("High"));

export const taskTypeValidator = v.union(
  v.literal("Content"),
  v.literal("Marketing"),
  v.literal("Dev"),
  v.literal("Bug Fix"),
  v.literal("Automation"),
  v.literal("AI")
);
