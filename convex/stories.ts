import { ConvexError, v } from "convex/values";

import { mutation, query } from "./_generated/server";

// create story mutation
export const createStory = mutation({
  args: {
    audioStorageId: v.id("_storage"),
    storyTitle: v.string(),
    storyDescription: v.string(),
    audioUrl: v.string(),
    imageUrl: v.string(),
    imageStorageId: v.id("_storage"),
    voicePrompt: v.string(),
    imagePrompt: v.string(),
    voiceType: v.string(),
    views: v.number(),
    audioDuration: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("User not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), identity.email))
      .collect();

    if (user.length === 0) {
      throw new ConvexError("User not found");
    }

    return await ctx.db.insert("stories", {
      audioStorageId: args.audioStorageId,
      user: user[0]._id,
      storyTitle: args.storyTitle,
      storyDescription: args.storyDescription,
      audioUrl: args.audioUrl,
      imageUrl: args.imageUrl,
      imageStorageId: args.imageStorageId,
      author: user[0].name,
      authorId: user[0].clerkId,
      voicePrompt: args.voicePrompt,
      imagePrompt: args.imagePrompt,
      voiceType: args.voiceType,
      views: args.views,
      authorImageUrl: user[0].imageUrl,
      audioDuration: args.audioDuration,
    });
  },
});

// this mutation is required to generate the url after uploading the file to the storage.
export const getUrl = mutation({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

// this query will get all the stories based on the voiceType of the story , which we are showing in the Similar Stories section.
export const getStoryByVoiceType = query({
  args: {
    storyId: v.id("stories"),
  },
  handler: async (ctx, args) => {
    const story = await ctx.db.get(args.storyId);

    return await ctx.db
      .query("stories")
      .filter((q) =>
        q.and(
          q.eq(q.field("voiceType"), story?.voiceType),
          q.neq(q.field("_id"), args.storyId)
        )
      )
      .collect();
  },
});

// this query will get all the stories.
export const getAllStories = query({
  handler: async (ctx) => {
    return await ctx.db.query("stories").order("desc").collect();
  },
});

// this query will get the story by the storyId.
export const getStoryById = query({
  args: {
    storyId: v.id("stories"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.storyId);
  },
});

// this query will get the stories based on the views of the story , which we are showing in the Trending Stories section.
export const getTreandingStories = query({
  handler: async (ctx) => {
    const story = await ctx.db.query("stories").collect();

    return story.sort((a, b) => b.views - a.views).slice(0, 8);
  },
});

// this query will get the story by the authorId.
export const getStoryByAuthorId = query({
  args: {
    authorId: v.string(),
  },
  handler: async (ctx, args) => {
    const stories = await ctx.db
      .query("stories")
      .filter((q) => q.eq(q.field("authorId"), args.authorId))
      .collect();

    const totalListeners = stories.reduce(
      (sum, story) => sum + story.views,
      0
    );

    return { stories, listeners: totalListeners };
  },
});

// this query will get the story by the search query.
export const getStoryBySearch = query({
  args: {
    search: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.search === "") {
      return await ctx.db.query("stories").order("desc").collect();
    }

    const authorSearch = await ctx.db
      .query("stories")
      .withSearchIndex("search_author", (q) => q.search("author", args.search))
      .take(10);

    if (authorSearch.length > 0) {
      return authorSearch;
    }

    const titleSearch = await ctx.db
      .query("stories")
      .withSearchIndex("search_title", (q) =>
        q.search("storyTitle", args.search)
      )
      .take(10);

    if (titleSearch.length > 0) {
      return titleSearch;
    }

    return await ctx.db
      .query("stories")
      .withSearchIndex("search_body", (q) =>
        q.search("storyDescription" || "storyTitle", args.search)
      )
      .take(10);
  },
});

// this mutation will update the views of the story.
export const updateStoryViews = mutation({
  args: {
    storyId: v.id("stories"),
  },
  handler: async (ctx, args) => {
    const story = await ctx.db.get(args.storyId);

    if (!story) {
      throw new ConvexError("Story not found");
    }

    return await ctx.db.patch(args.storyId, {
      views: story.views + 1,
    });
  },
});

// this mutation will delete the story.
export const deleteStory = mutation({
  args: {
    storyId: v.id("stories"),
    imageStorageId: v.id("_storage"),
    audioStorageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const story = await ctx.db.get(args.storyId);

    if (!story) {
      throw new ConvexError("Story not found");
    }

    await ctx.storage.delete(args.imageStorageId);
    await ctx.storage.delete(args.audioStorageId);
    return await ctx.db.delete(args.storyId);
  },
});