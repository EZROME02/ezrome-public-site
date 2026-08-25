import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { addVideo, createPost, followChannel, getOrCreateChannel, getVideoById, incrementShare, listChannel, listNotifications, listPosts, listVideos, listOfflineDownloadRecords, getDownloadCandidate, removeFollow } from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { storageGetSignedUrl, storagePut } from "./storage";
import { assertAllowedThumbnailUpload, assertAllowedVideoUpload, safeUploadName } from "./videoValidation";

const MAX_BASE64_CHARS = 17_000_000;
const mediaInput = z.object({ name: z.string().min(1).max(180), type: z.string().min(1).max(128), base64: z.string().min(1).max(MAX_BASE64_CHARS) });

function decodeMedia(media: z.infer<typeof mediaInput>) { return Buffer.from(media.base64, "base64"); }

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => { ctx.res.clearCookie(COOKIE_NAME, { ...getSessionCookieOptions(ctx.req), maxAge: -1 }); return { success: true } as const; }),
  }),
  media: router({
    feed: publicProcedure.input(z.object({ format: z.enum(["video", "short"]).optional(), limit: z.number().int().min(1).max(48).default(24) })).query(({ input }) => listVideos(input)),
    watch: publicProcedure.input(z.object({ id: z.number().int().positive() })).query(({ input }) => getVideoById(input.id)),
    channel: publicProcedure.input(z.object({ handle: z.string().min(1).max(64) })).query(({ input }) => listChannel(input.handle)),
    community: publicProcedure.input(z.object({ topic: z.enum(["community", "football", "build"]).optional() }).optional()).query(({ input }) => listPosts(input?.topic)),
    notifications: protectedProcedure.query(({ ctx }) => listNotifications(ctx.user.id)),
    offlineLibrary: protectedProcedure.query(({ ctx }) => listOfflineDownloadRecords(ctx.user.id)),
    offlineTicket: protectedProcedure.input(z.object({ id: z.number().int().positive() })).query(async ({ ctx, input }) => {
      const candidate = await getDownloadCandidate(ctx.user.id, input.id);
      if (!candidate) throw new Error("This video is not available for offline playback.");
      return { id: candidate.id, title: candidate.title, format: candidate.format, mimeType: candidate.mimeType, channelName: candidate.channelName, url: await storageGetSignedUrl(candidate.videoKey) };
    }),
    station: protectedProcedure.query(async ({ ctx }) => {
      const channel = await getOrCreateChannel(ctx.user);
      if (!channel) throw new Error("Channel setup is temporarily unavailable.");
      return channel;
    }),
    share: publicProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ input }) => { await incrementShare(input.id); return { success: true } as const; }),
    publish: protectedProcedure.input(z.object({ title: z.string().trim().min(3).max(120), description: z.string().trim().max(2000).optional(), format: z.enum(["video", "short"]), visibility: z.enum(["public", "unlisted"]), video: mediaInput, thumbnail: mediaInput.optional() })).mutation(async ({ ctx, input }) => {
      const channel = await getOrCreateChannel(ctx.user);
      if (!channel) throw new Error("Channel setup is temporarily unavailable.");
      const videoBuffer = decodeMedia(input.video);
      assertAllowedVideoUpload(input.video.type, videoBuffer.byteLength);
      const video = await storagePut(`creator-media/${ctx.user.id}/video/${safeUploadName(input.video.name, "video")}`, videoBuffer, input.video.type);
      let thumbnail: { key: string; url: string } | undefined;
      if (input.thumbnail) { const thumbnailBuffer = decodeMedia(input.thumbnail); assertAllowedThumbnailUpload(input.thumbnail.type, thumbnailBuffer.byteLength); thumbnail = await storagePut(`creator-media/${ctx.user.id}/thumbnail/${safeUploadName(input.thumbnail.name, "thumb")}`, thumbnailBuffer, input.thumbnail.type); }
      const id = await addVideo({ userId: ctx.user.id, channelId: channel.id, title: input.title, description: input.description || undefined, format: input.format, visibility: input.visibility, videoKey: video.key, videoUrl: video.url, mimeType: input.video.type, thumbnailKey: thumbnail?.key, thumbnailUrl: thumbnail?.url });
      return { id, channelHandle: channel.handle };
    }),
    post: protectedProcedure.input(z.object({ body: z.string().trim().min(3).max(1000), topic: z.enum(["community", "football", "build"]) })).mutation(async ({ ctx, input }) => { const channel = await getOrCreateChannel(ctx.user); if (!channel) throw new Error("Channel setup is temporarily unavailable."); return { id: await createPost({ userId: ctx.user.id, channelId: channel.id, ...input }) }; }),
    follow: protectedProcedure.input(z.object({ channelId: z.number().int().positive(), following: z.boolean() })).mutation(async ({ ctx, input }) => { if (input.following) await followChannel({ followerUserId: ctx.user.id, channelId: input.channelId }); else await removeFollow({ followerUserId: ctx.user.id, channelId: input.channelId }); return { success: true } as const; }),
  }),
});

export type AppRouter = typeof appRouter;
