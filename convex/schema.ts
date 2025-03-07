import { defineSchema, defineTable } from "convex/server"
import { Infer, v } from "convex/values"

export const INTERVALS = {
    MONTH: "month",
    YEAR: "year",
} as const;

export const intervalValidator = v.union(
    v.literal(INTERVALS.MONTH),
    v.literal(INTERVALS.YEAR),
);

export type Interval = Infer<typeof intervalValidator>;

// Define a price object structure that matches your data
const priceValidator = v.object({
    amount: v.number(),
    polarId: v.string(),
});

// Define a prices object structure for a specific interval
const intervalPricesValidator = v.object({
    usd: priceValidator,
});

// Define brand voice pillar structure
const brandVoicePillarValidator = v.object({
    name: v.string(),
    whatItMeans: v.array(v.string()),
    whatItDoesntMean: v.array(v.string()),
    iconicBrandInspiration: v.array(v.string()),
});

export default defineSchema({
    users: defineTable({
        createdAt: v.string(),
        email: v.string(),
        name: v.optional(v.string()),
        image: v.optional(v.string()),
        userId: v.string(),
        subscription: v.optional(v.string()),
        credits: v.optional(v.string()),
        tokenIdentifier: v.string(),
        // Add a reference to the user's brand voice
        brandVoiceId: v.optional(v.id("brandVoices")),
    }).index("by_token", ["tokenIdentifier"]),
    plans: defineTable({
        key: v.string(),
        name: v.string(),
        description: v.string(),
        polarProductId: v.string(),
        prices: v.object({
            month: v.optional(intervalPricesValidator),
            year: v.optional(intervalPricesValidator),
        }),
    })
        .index("key", ["key"])
        .index("polarProductId", ["polarProductId"]),
    subscriptions: defineTable({
        userId: v.optional(v.string()),
        polarId: v.optional(v.string()),
        polarPriceId: v.optional(v.string()),
        currency: v.optional(v.string()),
        interval: v.optional(v.string()),
        status: v.optional(v.string()),
        currentPeriodStart: v.optional(v.number()),
        currentPeriodEnd: v.optional(v.number()),
        cancelAtPeriodEnd: v.optional(v.boolean()),
        amount: v.optional(v.number()),
        startedAt: v.optional(v.number()),
        endsAt: v.optional(v.number()),
        endedAt: v.optional(v.number()),
        canceledAt: v.optional(v.number()),
        customerCancellationReason: v.optional(v.string()),
        customerCancellationComment: v.optional(v.string()),
        metadata: v.optional(v.any()),
        customFieldData: v.optional(v.any()),
        customerId: v.optional(v.string()),
    })
        .index("userId", ["userId"])
        .index("polarId", ["polarId"]),
    webhookEvents: defineTable({
        type: v.string(),
        polarEventId: v.string(),
        createdAt: v.string(),
        modifiedAt: v.string(),
        data: v.any(),
    })
        .index("type", ["type"])
        .index("polarEventId", ["polarEventId"]),
    // New table for onboarding data
    onboardingData: defineTable({
        userId: v.optional(v.string()), // Optional for non-logged in users
        sessionId: v.string(), // For tracking non-logged in users
        businessName: v.string(),
        yearFounded: v.string(),
        businessDescription: v.string(),
        website: v.optional(v.string()),
        targetAudience: v.string(),
        companyValues: v.string(),
        additionalInfo: v.optional(v.string()),
        createdAt: v.string(),
        updatedAt: v.string(),
    })
        .index("by_userId", ["userId"])
        .index("by_sessionId", ["sessionId"]),
    // New table for brand voices
    brandVoices: defineTable({
        userId: v.string(),
        name: v.string(), // Name of the brand voice (usually the business name)
        pillars: v.array(brandVoicePillarValidator),
        createdAt: v.string(),
        updatedAt: v.string(),
        onboardingDataId: v.id("onboardingData"), // Reference to the onboarding data
    })
        .index("by_userId", ["userId"]),
    // New table for content
    content: defineTable({
        userId: v.string(),
        brandVoiceId: v.id("brandVoices"),
        title: v.string(),
        type: v.string(), // blog, social, email, etc.
        content: v.string(),
        tags: v.array(v.string()),
        createdAt: v.string(),
        updatedAt: v.string(),
        metadata: v.optional(v.object({
            readingLevel: v.optional(v.string()),
            tone: v.optional(v.string()),
            length: v.optional(v.string()),
            targetAudience: v.optional(v.string()),
        })),
    })
        .index("by_userId", ["userId"])
        .index("by_brandVoiceId", ["brandVoiceId"])
        .index("by_type", ["type"])
        .index("by_createdAt", ["createdAt"]),
})