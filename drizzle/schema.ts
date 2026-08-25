import { index, int, mysqlEnum, mysqlTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const channels = mysqlTable("channels", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  handle: varchar("handle", { length: 64 }).notNull(),
  displayName: varchar("displayName", { length: 120 }).notNull(),
  bio: text("bio"),
  accentColor: varchar("accentColor", { length: 16 }).notNull().default("#19E6D2"),
  avatarUrl: text("avatarUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [
  uniqueIndex("channels_user_unique").on(table.userId),
  uniqueIndex("channels_handle_unique").on(table.handle),
]);

export const videos = mysqlTable("videos", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  channelId: int("channelId").notNull().references(() => channels.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 120 }).notNull(),
  description: text("description"),
  format: mysqlEnum("format", ["video", "short"]).notNull().default("video"),
  visibility: mysqlEnum("visibility", ["public", "unlisted"]).notNull().default("public"),
  status: mysqlEnum("status", ["published", "processing", "rejected"]).notNull().default("published"),
  videoKey: text("videoKey").notNull(),
  videoUrl: text("videoUrl").notNull(),
  mimeType: varchar("mimeType", { length: 128 }).notNull(),
  thumbnailKey: text("thumbnailKey"),
  thumbnailUrl: text("thumbnailUrl"),
  viewCount: int("viewCount").notNull().default(0),
  shareCount: int("shareCount").notNull().default(0),
  publishedAt: timestamp("publishedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [
  index("videos_feed_idx").on(table.status, table.visibility, table.publishedAt),
  index("videos_channel_idx").on(table.channelId, table.publishedAt),
  index("videos_creator_idx").on(table.userId, table.createdAt),
]);

export type Channel = typeof channels.$inferSelect;
export type InsertChannel = typeof channels.$inferInsert;
export type Video = typeof videos.$inferSelect;
export type InsertVideo = typeof videos.$inferInsert;

export const posts = mysqlTable("posts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  channelId: int("channelId").notNull().references(() => channels.id, { onDelete: "cascade" }),
  topic: mysqlEnum("topic", ["community", "football", "build"]).notNull().default("community"),
  body: text("body").notNull(),
  reactionCount: int("reactionCount").notNull().default(0),
  commentCount: int("commentCount").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [
  index("posts_topic_feed_idx").on(table.topic, table.createdAt),
  index("posts_channel_idx").on(table.channelId, table.createdAt),
]);

export const comments = mysqlTable("comments", {
  id: int("id").autoincrement().primaryKey(),
  postId: int("postId").notNull().references(() => posts.id, { onDelete: "cascade" }),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  body: text("body").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => [index("comments_post_idx").on(table.postId, table.createdAt)]);

export const reactions = mysqlTable("reactions", {
  id: int("id").autoincrement().primaryKey(),
  postId: int("postId").notNull().references(() => posts.id, { onDelete: "cascade" }),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  kind: mysqlEnum("kind", ["spark", "fire", "insight"]).notNull().default("spark"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => [uniqueIndex("reactions_user_post_unique").on(table.userId, table.postId)]);

export const follows = mysqlTable("follows", {
  id: int("id").autoincrement().primaryKey(),
  followerUserId: int("followerUserId").notNull().references(() => users.id, { onDelete: "cascade" }),
  channelId: int("channelId").notNull().references(() => channels.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => [uniqueIndex("follows_user_channel_unique").on(table.followerUserId, table.channelId)]);

export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  recipientUserId: int("recipientUserId").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: mysqlEnum("type", ["follow", "reaction", "comment", "system"]).notNull(),
  message: varchar("message", { length: 280 }).notNull(),
  href: varchar("href", { length: 255 }),
  readAt: timestamp("readAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => [index("notifications_user_idx").on(table.recipientUserId, table.createdAt)]);

export type Post = typeof posts.$inferSelect;
export type Comment = typeof comments.$inferSelect;
export type Reaction = typeof reactions.$inferSelect;
export type Follow = typeof follows.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
