import {
  integer,
  pgEnum,
  pgTable,
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
  muxStatus: varchar("mux_status", { length: 10 }).default("waiting"),
  muxAssetId: varchar("mux_asset_id", { length: 50 }),
  muxUploadId: varchar("mux_upload_id", { length: 50 }),
  muxPlaybackId: varchar("mux_playback_id", { length: 255 }),
  muxTrackId: varchar("mux_track_id", { length: 255 }),
  muxTrackStatus: varchar("mux_track_status", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const videoRelations = relations(videos, ({ one }) => ({
  user: one(usersTable, {
    fields: [videos.userId],
    references: [usersTable.id],
  }),
  category: one(categories, {
    fields: [videos.categoryId],
    references: [categories.id],
  }),
}));
