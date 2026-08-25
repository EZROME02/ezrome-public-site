import { and, desc, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { Channel, channels, comments, follows, InsertUser, notifications, posts, reactions, users, videoDownloads, videos } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try { _db = drizzle(process.env.DATABASE_URL); } catch (error) { console.warn("[Database] Failed to connect:", error); _db = null; }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values: InsertUser = { openId: user.openId, name: user.name ?? null, email: user.email ?? null, loginMethod: user.loginMethod ?? null, lastSignedIn: new Date(), role: user.role ?? (user.openId === ENV.ownerOpenId ? "admin" : "user") };
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: { name: values.name, email: values.email, loginMethod: values.loginMethod, lastSignedIn: new Date() } });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

function handleFromName(name: string | null, id: number) {
  const core = (name || "creator").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 45) || "creator";
  return `${core}-${id}`;
}

export async function getOrCreateChannel(user: { id: number; name: string | null }): Promise<Channel | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const existing = await db.select().from(channels).where(eq(channels.userId, user.id)).limit(1);
  if (existing[0]) return existing[0];
  await db.insert(channels).values({ userId: user.id, handle: handleFromName(user.name, user.id), displayName: user.name?.slice(0, 120) || "EZROME Creator" });
  const created = await db.select().from(channels).where(eq(channels.userId, user.id)).limit(1);
  return created[0];
}

export async function listVideos(input: { format?: "video" | "short"; limit: number }) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [eq(videos.status, "published"), eq(videos.visibility, "public")];
  if (input.format) conditions.push(eq(videos.format, input.format));
  return db.select({ id: videos.id, title: videos.title, description: videos.description, format: videos.format, videoUrl: videos.videoUrl, thumbnailUrl: videos.thumbnailUrl, viewCount: videos.viewCount, shareCount: videos.shareCount, publishedAt: videos.publishedAt, downloadable: videos.downloadable, channelHandle: channels.handle, channelName: channels.displayName, channelAccent: channels.accentColor, channelAvatar: channels.avatarUrl }).from(videos).innerJoin(channels, eq(videos.channelId, channels.id)).where(and(...conditions)).orderBy(desc(videos.publishedAt)).limit(input.limit);
}

export async function getVideoById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select({ id: videos.id, title: videos.title, description: videos.description, format: videos.format, videoUrl: videos.videoUrl, thumbnailUrl: videos.thumbnailUrl, viewCount: videos.viewCount, shareCount: videos.shareCount, publishedAt: videos.publishedAt, channelId: channels.id, downloadable: videos.downloadable, channelHandle: channels.handle, channelName: channels.displayName, channelBio: channels.bio, channelAccent: channels.accentColor }).from(videos).innerJoin(channels, eq(videos.channelId, channels.id)).where(eq(videos.id, id)).limit(1);
  return rows[0];
}

export async function addVideo(input: { userId: number; channelId: number; title: string; description?: string; format: "video" | "short"; videoKey: string; videoUrl: string; mimeType: string; thumbnailKey?: string; thumbnailUrl?: string; visibility: "public" | "unlisted" }) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const result = await db.insert(videos).values(input);
  return Number(result[0].insertId);
}

export async function listChannel(handle: string) {
  const db = await getDb();
  if (!db) return undefined;
  const channel = (await db.select().from(channels).where(eq(channels.handle, handle)).limit(1))[0];
  if (!channel) return undefined;
  const items = await db.select({ id: videos.id, title: videos.title, format: videos.format, videoUrl: videos.videoUrl, thumbnailUrl: videos.thumbnailUrl, viewCount: videos.viewCount, publishedAt: videos.publishedAt }).from(videos).where(and(eq(videos.channelId, channel.id), eq(videos.status, "published"))).orderBy(desc(videos.publishedAt));
  return { channel, videos: items };
}

export async function listPosts(topic?: "community" | "football" | "build") {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.select({ id: posts.id, body: posts.body, topic: posts.topic, reactionCount: posts.reactionCount, commentCount: posts.commentCount, createdAt: posts.createdAt, channelHandle: channels.handle, channelName: channels.displayName, channelAccent: channels.accentColor }).from(posts).innerJoin(channels, eq(posts.channelId, channels.id)).where(topic ? eq(posts.topic, topic) : undefined).orderBy(desc(posts.createdAt)).limit(30);
  return rows;
}

export async function createPost(input: { userId: number; channelId: number; body: string; topic: "community" | "football" | "build" }) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  const result = await db.insert(posts).values(input);
  return Number(result[0].insertId);
}

export async function followChannel(input: { followerUserId: number; channelId: number }) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.insert(follows).values(input).onDuplicateKeyUpdate({ set: { channelId: input.channelId } });
}

export async function removeFollow(input: { followerUserId: number; channelId: number }) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.delete(follows).where(and(eq(follows.followerUserId, input.followerUserId), eq(follows.channelId, input.channelId)));
}

export async function listNotifications(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(notifications).where(eq(notifications.recipientUserId, userId)).orderBy(desc(notifications.createdAt)).limit(20);
}

export async function incrementShare(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(videos).set({ shareCount: sql`${videos.shareCount} + 1` }).where(eq(videos.id, id));
}

export const unusedSocialTables = { comments, reactions };

export async function getDownloadCandidate(userId: number, videoId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select({
    id: videos.id,
    title: videos.title,
    description: videos.description,
    format: videos.format,
    videoKey: videos.videoKey,
    mimeType: videos.mimeType,
    downloadable: videos.downloadable,
    channelName: channels.displayName,
  }).from(videos).innerJoin(channels, eq(videos.channelId, channels.id)).where(and(eq(videos.id, videoId), eq(videos.status, "published"), eq(videos.visibility, "public"))).limit(1);
  const candidate = rows[0];
  if (!candidate || candidate.downloadable !== 1) return undefined;
  await db.insert(videoDownloads).values({ userId, videoId }).onDuplicateKeyUpdate({ set: { lastAccessedAt: new Date() } });
  return candidate;
}

export async function listOfflineDownloadRecords(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select({
    id: videoDownloads.videoId,
    title: videos.title,
    format: videos.format,
    mimeType: videos.mimeType,
    channelName: channels.displayName,
    savedAt: videoDownloads.createdAt,
  }).from(videoDownloads).innerJoin(videos, eq(videoDownloads.videoId, videos.id)).innerJoin(channels, eq(videos.channelId, channels.id)).where(and(eq(videoDownloads.userId, userId), eq(videos.status, "published"))).orderBy(desc(videoDownloads.createdAt)).limit(100);
}
