import type { QueryCtx } from "./_generated/server";
import { internalMutation, mutation, query } from "./_generated/server";
import type { UserJSON } from "@clerk/backend";
import { v } from "convex/values";

/** Store/update current user from JWT (call on login as fallback if webhook hasn't run) */
export const store = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const existing = await ctx.db
      .query("users")
      .withIndex("by_external_id", (q) => q.eq("externalId", identity.subject))
      .unique();
    const name = identity.name ?? "Anonymous";
    if (existing) {
      if (existing.name !== name) {
        await ctx.db.patch(existing._id, { name });
      }
      return existing._id;
    }
    return await ctx.db.insert("users", {
      name,
      externalId: identity.subject,
      email: identity.email ?? undefined,
      imageUrl: typeof identity.picture === "string" ? identity.picture : undefined,
    });
  },
});

/** Get the current user from Convex (synced from Clerk) */
export const current = query({
  args: {},
  handler: async (ctx) => {
    return await getCurrentUser(ctx);
  },
});

/** Upsert user from Clerk webhook (user.created / user.updated) */
export const upsertFromClerk = internalMutation({
  args: { data: v.any() },
  handler: async (ctx, { data }) => {
    const userData = data as UserJSON;
    const name =
      [userData.first_name, userData.last_name].filter(Boolean).join(" ") ||
      "Anonymous";
    const primaryEmail = userData.primary_email_address_id
      ? userData.email_addresses?.find(
          (e) => e.id === userData.primary_email_address_id
        )?.email_address
      : userData.email_addresses?.[0]?.email_address;

    const existing = await ctx.db
      .query("users")
      .withIndex("by_external_id", (q) => q.eq("externalId", userData.id))
      .unique();

    const userAttributes = {
      name,
      externalId: userData.id,
      email: primaryEmail ?? undefined,
      imageUrl: userData.image_url || undefined,
    };

    if (existing) {
      await ctx.db.patch(existing._id, userAttributes);
      return existing._id;
    }
    return await ctx.db.insert("users", userAttributes);
  },
});

/** Delete user from Clerk webhook (user.deleted) */
export const deleteFromClerk = internalMutation({
  args: { clerkUserId: v.string() },
  handler: async (ctx, { clerkUserId }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_external_id", (q) => q.eq("externalId", clerkUserId))
      .unique();

    if (user) {
      await ctx.db.delete(user._id);
    }
  },
});

export async function getCurrentUser(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;
  return await userByExternalId(ctx, identity.subject);
}

export async function getCurrentUserOrThrow(ctx: QueryCtx) {
  const user = await getCurrentUser(ctx);
  if (!user) throw new Error("Not authenticated");
  return user;
}

async function userByExternalId(ctx: QueryCtx, externalId: string) {
  return await ctx.db
    .query("users")
    .withIndex("by_external_id", (q) => q.eq("externalId", externalId))
    .unique();
}
