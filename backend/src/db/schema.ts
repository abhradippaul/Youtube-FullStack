import {
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const usersTable = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clerkId: text("clerk_id").unique().notNull(),
    name: varchar("name", { length: 150 }).notNull(),
    username: varchar("username", { length: 100 }).unique().notNull(),
    email: varchar("email", { length: 100 }).unique().notNull(),
    avatarUrl: varchar("avatar_url", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("clerk_id_idx").on(t.clerkId)]
);

export const userRelations = relations(usersTable, ({ many }) => ({
  videos: many(videos),
  views: many(videoViews),
  reactions: many(videoReactions),
  subscriptions: many(subscriptions, {
    relationName: "subscriptions_viewer_id_fkey",
  }),
  subscribers: many(subscriptions, {
    relationName: "subscriptions_creator_id_fkey",
  }),
}));

export const subscriptions = pgTable(
  "subscriptions",
  {
    creatorId: uuid("creator_id")
      .references(() => usersTable.id, { onDelete: "cascade" })
      .notNull(),
    viewerId: uuid("viewer_id")
      .references(() => usersTable.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    primaryKey({
      name: "subscription_pk",
      columns: [t.creatorId, t.viewerId],
    }),
  ]
);

export const subscriptionRelation = relations(subscriptions, ({ one }) => ({
  creatorId: one(usersTable, {
    fields: [subscriptions.creatorId],
    references: [usersTable.id],
    relationName: "subscriptions_creator_id_fkey",
  }),
  viewerId: one(usersTable, {
    fields: [subscriptions.viewerId],
    references: [usersTable.id],
    relationName: "subscriptions_viewer_id_fkey",
  }),
}));

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar({ length: 50 }).unique().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("name_idx").on(t.name)]
);

export const categoryRelation = relations(categories, ({ many }) => ({
  videos: many(videos),
  views: many(videoViews),
}));

export const videoVisibility = pgEnum("video_visibility", [
  "private",
  "public",
]);

export const videos = pgTable("videos", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar({ length: 150 }).notNull(),
  description: varchar({ length: 255 }),
  userId: uuid("user_id")
    .references(() => usersTable.id, {
      onDelete: "cascade",
    })
    .notNull(),
  categoryId: uuid("category").references(() => categories.id, {
    onDelete: "set null",
  }),
  duration: integer("duration").default(0),
  visibility: varchar("visibility", { length: 8 }).default("private"),
  muxStatus: varchar("mux_status", { length: 15 }).default("waiting"),
  muxAssetId: varchar("mux_asset_id", { length: 50 }),
  muxUploadId: varchar("mux_upload_id", { length: 50 }),
  muxPlaybackId: varchar("mux_playback_id", { length: 255 }),
  muxTrackId: varchar("mux_track_id", { length: 255 }),
  muxTrackStatus: varchar("mux_track_status", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const videoRelations = relations(videos, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [videos.userId],
    references: [usersTable.id],
  }),
  category: one(categories, {
    fields: [videos.categoryId],
    references: [categories.id],
  }),
  views: many(videoViews),
  reactions: many(videoReactions),
}));

export const videoViews = pgTable(
  "video_views",
  {
    userId: uuid("user_id")
      .references(() => usersTable.id, { onDelete: "cascade" })
      .notNull(),
    videoId: uuid("video_id")
      .references(() => videos.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    primaryKey({
      name: "video_views_pk",
      columns: [t.userId, t.videoId],
    }),
  ]
);

export const videoViewRelations = relations(videoViews, ({ one }) => ({
  user: one(usersTable, {
    fields: [videoViews.userId],
    references: [usersTable.id],
  }),
  video: one(videos, {
    fields: [videoViews.videoId],
    references: [videos.id],
  }),
}));

export const reactionType = pgEnum("reaction_type", ["like", "dislike"]);

export const videoReactions = pgTable(
  "video_reactions",
  {
    userId: uuid("user_id")
      .references(() => usersTable.id, { onDelete: "cascade" })
      .notNull(),
    type: reactionType("type"),
    videoId: uuid("video_id")
      .references(() => videos.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    primaryKey({
      name: "video_reactions_pk",
      columns: [t.userId, t.videoId],
    }),
  ]
);

export const videoReactionsRelations = relations(videoReactions, ({ one }) => ({
  user: one(usersTable, {
    fields: [videoReactions.userId],
    references: [usersTable.id],
  }),
  video: one(videos, {
    fields: [videoReactions.videoId],
    references: [videos.id],
  }),
}));
