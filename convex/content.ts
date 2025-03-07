import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Create new content
export const createContent = mutation({
  args: {
    brandVoiceId: v.id("brandVoices"),
    title: v.string(),
    type: v.string(),
    content: v.string(),
    tags: v.array(v.string()),
    metadata: v.optional(
      v.object({
        readingLevel: v.optional(v.string()),
        tone: v.optional(v.string()),
        length: v.optional(v.string()),
        targetAudience: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Verify the brand voice belongs to the user
    const brandVoice = await ctx.db.get(args.brandVoiceId);
    if (!brandVoice || brandVoice.userId !== identity.subject) {
      throw new Error("Brand voice not found or not authorized");
    }

    const now = new Date().toISOString();

    return await ctx.db.insert("content", {
      userId: identity.subject,
      brandVoiceId: args.brandVoiceId,
      title: args.title,
      type: args.type,
      content: args.content,
      tags: args.tags,
      createdAt: now,
      updatedAt: now,
      metadata: args.metadata || {},
    });
  },
});

// Get content by ID
export const getContentById = query({
  args: { contentId: v.id("content") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const content = await ctx.db.get(args.contentId);
    if (!content || content.userId !== identity.subject) {
      return null;
    }

    return content;
  },
});

// Get all content for a user
export const getUserContent = query({
  args: {
    type: v.optional(v.string()),
    searchQuery: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    limit: v.optional(v.number()),
    cursor: v.optional(v.id("content")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return { content: [], cursor: null };
    }

    let query = ctx.db
      .query("content")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject));

    // Apply type filter if provided
    if (args.type) {
      query = query.filter((q) => q.eq(q.field("type"), args.type));
    }

    // Apply tag filter if provided
    if (args.tags && args.tags.length > 0) {
      query = query.filter((q) => {
        // Check if any of the document's tags match any of the query tags
        return q.or(
          ...args.tags!.map(tag => 
            // Use array.includes() instead of Expression<string[]>.includes()
            q.eq(tag, q.field("tags")) || 
            q.and(
              q.neq(q.field("tags"), undefined),
              q.neq(q.field("tags"), null),
              q.includes(tag, q.field("tags"))
            )
          )
        );
      });
    }

    // Apply search filter if provided
    if (args.searchQuery) {
      const searchLower = args.searchQuery.toLowerCase();
      // Use appropriate filter methods instead of text
      query = query.filter((q) =>
        q.or(
          q.includes(searchLower, q.field("title").toLowerCase()),
          q.includes(searchLower, q.field("content").toLowerCase())
        )
      );
    }

    // Apply pagination
    const limit = args.limit ?? 10;
    
    // Order by creation time descending - store as ordered query
    const orderedQuery = query.order("desc");
    
    // Apply cursor-based pagination if a cursor is provided
    let paginatedQuery = orderedQuery;
    if (args.cursor) {
      paginatedQuery = orderedQuery.after(args.cursor);
    }
    
    // Take one more than the limit to determine if there are more results
    const results = await paginatedQuery.take(limit + 1);

    let cursor = null;
    let contentResults = [...results];
    
    // If we got more results than the limit, set the cursor and remove the extra item
    if (results.length > limit) {
      cursor = results[limit]._id;
      contentResults = results.slice(0, limit);
    }

    return {
      content: contentResults,
      cursor,
    };
  },
});

// Update content
export const updateContent = mutation({
  args: {
    contentId: v.id("content"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    metadata: v.optional(
      v.object({
        readingLevel: v.optional(v.string()),
        tone: v.optional(v.string()),
        length: v.optional(v.string()),
        targetAudience: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const content = await ctx.db.get(args.contentId);
    if (!content || content.userId !== identity.subject) {
      throw new Error("Content not found or not authorized");
    }

    const updates: any = {
      updatedAt: new Date().toISOString(),
    };

    if (args.title !== undefined) {
      updates.title = args.title;
    }

    if (args.content !== undefined) {
      updates.content = args.content;
    }

    if (args.tags !== undefined) {
      updates.tags = args.tags;
    }

    if (args.metadata !== undefined) {
      updates.metadata = {
        ...content.metadata,
        ...args.metadata,
      };
    }

    await ctx.db.patch(args.contentId, updates);

    return args.contentId;
  },
});

// Delete content
export const deleteContent = mutation({
  args: {
    contentId: v.id("content"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const content = await ctx.db.get(args.contentId);
    if (!content || content.userId !== identity.subject) {
      throw new Error("Content not found or not authorized");
    }

    await ctx.db.delete(args.contentId);

    return true;
  },
});

// Get content types and tags for a user (for filtering)
export const getUserContentMetadata = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return { types: [], tags: [] };
    }

    const content = await ctx.db
      .query("content")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .collect();

    const types = new Set<string>();
    const tags = new Set<string>();

    content.forEach((item) => {
      types.add(item.type);
      item.tags.forEach((tag: string) => tags.add(tag));
    });

    return {
      types: Array.from(types),
      tags: Array.from(tags),
    };
  },
}); 