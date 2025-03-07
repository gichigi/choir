import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Get a user's brand voice
export const getUserBrandVoice = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();

    if (!user || !user.brandVoiceId) {
      return null;
    }

    return await ctx.db.get(user.brandVoiceId);
  },
});

// Get a brand voice by ID
export const getBrandVoiceById = query({
  args: { brandVoiceId: v.id("brandVoices") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.brandVoiceId);
  },
});

// Create a brand voice from onboarding data
export const createBrandVoice = mutation({
  args: {
    onboardingDataId: v.id("onboardingData"),
    pillars: v.array(
      v.object({
        name: v.string(),
        whatItMeans: v.array(v.string()),
        whatItDoesntMean: v.array(v.string()),
        iconicBrandInspiration: v.array(v.string()),
      })
    ),
    businessSummary: v.optional(v.string()),
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

    const onboardingData = await ctx.db.get(args.onboardingDataId);
    if (!onboardingData) {
      throw new Error("Onboarding data not found");
    }

    // Create the brand voice
    const brandVoiceId = await ctx.db.insert("brandVoices", {
      userId: identity.subject,
      name: onboardingData.businessName,
      pillars: args.pillars,
      businessSummary: args.businessSummary,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      onboardingDataId: args.onboardingDataId,
    });

    // Update the user with the brand voice ID
    await ctx.db.patch(user._id, {
      brandVoiceId,
    });

    return brandVoiceId;
  },
});

// Update a brand voice
export const updateBrandVoice = mutation({
  args: {
    brandVoiceId: v.id("brandVoices"),
    name: v.optional(v.string()),
    pillars: v.optional(
      v.array(
        v.object({
          name: v.string(),
          whatItMeans: v.array(v.string()),
          whatItDoesntMean: v.array(v.string()),
          iconicBrandInspiration: v.array(v.string()),
        })
      )
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const brandVoice = await ctx.db.get(args.brandVoiceId);
    if (!brandVoice) {
      throw new Error("Brand voice not found");
    }

    if (brandVoice.userId !== identity.subject) {
      throw new Error("Not authorized to update this brand voice");
    }

    const updates: any = {
      updatedAt: new Date().toISOString(),
    };

    if (args.name) {
      updates.name = args.name;
    }

    if (args.pillars) {
      updates.pillars = args.pillars;
    }

    await ctx.db.patch(args.brandVoiceId, updates);

    return args.brandVoiceId;
  },
});

// Delete a brand voice
export const deleteBrandVoice = mutation({
  args: {
    brandVoiceId: v.id("brandVoices"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const brandVoice = await ctx.db.get(args.brandVoiceId);
    if (!brandVoice) {
      throw new Error("Brand voice not found");
    }

    if (brandVoice.userId !== identity.subject) {
      throw new Error("Not authorized to delete this brand voice");
    }

    // Find the user and remove the brand voice ID
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();

    if (user) {
      await ctx.db.patch(user._id, {
        brandVoiceId: undefined,
      });
    }

    await ctx.db.delete(args.brandVoiceId);

    return true;
  },
}); 