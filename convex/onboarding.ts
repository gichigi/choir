import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Save onboarding data for a session (signed out user)
export const saveOnboardingDataForSession = mutation({
  args: {
    sessionId: v.string(),
    businessName: v.string(),
    yearFounded: v.string(),
    businessDescription: v.string(),
    website: v.optional(v.string()),
    targetAudience: v.string(),
    companyValues: v.string(),
    additionalInfo: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if there's already onboarding data for this session
    const existingData = await ctx.db
      .query("onboardingData")
      .withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId))
      .first();

    const now = new Date().toISOString();

    if (existingData) {
      // Update existing data
      await ctx.db.patch(existingData._id, {
        businessName: args.businessName,
        yearFounded: args.yearFounded,
        businessDescription: args.businessDescription,
        website: args.website,
        targetAudience: args.targetAudience,
        companyValues: args.companyValues,
        additionalInfo: args.additionalInfo,
        updatedAt: now,
      });
      return existingData._id;
    } else {
      // Create new data
      return await ctx.db.insert("onboardingData", {
        sessionId: args.sessionId,
        businessName: args.businessName,
        yearFounded: args.yearFounded,
        businessDescription: args.businessDescription,
        website: args.website,
        targetAudience: args.targetAudience,
        companyValues: args.companyValues,
        additionalInfo: args.additionalInfo,
        createdAt: now,
        updatedAt: now,
      });
    }
  },
});

// Save onboarding data for a logged-in user
export const saveOnboardingDataForUser = mutation({
  args: {
    businessName: v.string(),
    yearFounded: v.string(),
    businessDescription: v.string(),
    website: v.optional(v.string()),
    targetAudience: v.string(),
    companyValues: v.string(),
    additionalInfo: v.optional(v.string()),
    sessionId: v.optional(v.string()), // Optional: to link with previous session data
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    const now = new Date().toISOString();

    // Check if there's already onboarding data for this user
    const existingData = await ctx.db
      .query("onboardingData")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first();

    // If there's session data and the user doesn't have onboarding data yet, check for session data
    let sessionData = null;
    if (args.sessionId && !existingData) {
      sessionData = await ctx.db
        .query("onboardingData")
        .withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId && typeof args.sessionId === 'string' ? args.sessionId : ""))
        .first();
    }

    if (existingData) {
      // Update existing data
      await ctx.db.patch(existingData._id, {
        businessName: args.businessName,
        yearFounded: args.yearFounded,
        businessDescription: args.businessDescription,
        website: args.website,
        targetAudience: args.targetAudience,
        companyValues: args.companyValues,
        additionalInfo: args.additionalInfo,
        updatedAt: now,
      });
      return existingData._id;
    } else if (sessionData) {
      // Update session data with user ID
      await ctx.db.patch(sessionData._id, {
        userId: identity.subject,
        updatedAt: now,
      });
      return sessionData._id;
    } else {
      // Create new data
      return await ctx.db.insert("onboardingData", {
        userId: identity.subject,
        sessionId: args.sessionId || `user-${identity.subject}`,
        businessName: args.businessName,
        yearFounded: args.yearFounded,
        businessDescription: args.businessDescription,
        website: args.website,
        targetAudience: args.targetAudience,
        companyValues: args.companyValues,
        additionalInfo: args.additionalInfo,
        createdAt: now,
        updatedAt: now,
      });
    }
  },
});

// Get onboarding data for a session
export const getOnboardingDataForSession = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("onboardingData")
      .withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId))
      .first();
  },
});

// Get onboarding data for a logged-in user
export const getOnboardingDataForUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    return await ctx.db
      .query("onboardingData")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .first();
  },
});

// Get onboarding data by ID
export const getOnboardingDataById = query({
  args: { onboardingDataId: v.id("onboardingData") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.onboardingDataId);
  },
}); 