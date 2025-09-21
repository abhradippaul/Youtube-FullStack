import { categories, videos } from "../db/schema";
import { db } from "../db";
import { Request, Response } from "express";
import { and, desc, eq, sql } from "drizzle-orm";

export async function getUserStudioVideos(req: Request, res: Response) {
  try {
    const { pageParam: cursor = 0, limit = 5 } = req.query;

    const { userId } = req.body;

    if (!userId) {
      return res.status(401).json({
        msg: "id is missing",
      });
    }

    const data = await db
      .select()
      .from(videos)
      .where(eq(videos.userId, userId))
      .orderBy(desc(videos.createdAt))
      .offset(Number(cursor))
      .limit(Number(limit) + 1);
    // console.log(cursor, limit);
    // const data = Array.from({ length: 100 })
    //   .map((_, i) => ({
    //     id: i,
    //     name: `Item ${i}`,
    //   }))
    //   .slice(Number(cursor), Number(cursor) + Number(limit) + 1);
    console.log(data);

    const hasMore = data.length > Number(limit);
    const items = data.length && hasMore ? data.slice(0, -1) : data;
    const nextCursor = hasMore ? Number(cursor) + Number(limit) : null;

    return res.status(200).json({
      nextCursor,
      items,
      msg: "Videos found successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Something went wrong", error: err });
  }
}

export async function getUserStudioVideo(req: Request, res: Response) {
  try {
    const { userId } = req.body;
    const { videoId } = req.params;

    if (!userId || !videoId) {
      return res.status(401).json({
        msg: "User id or video id is missing",
      });
    }

    const video = await db
      .select()
      .from(videos)
      .where(and(eq(videos.id, videoId), eq(videos.userId, userId)));

    if (!video.length) {
      return res.status(404).json({
        msg: "Video not found",
      });
    }

    return res.status(200).json({
      video,
      msg: "Video found successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Something went wrong", error: err });
  }
}

export async function updateUserStudioVideo(req: Request, res: Response) {
  try {
    const { userId, title, description, categoryId, visibility } = req.body;
    const { videoId } = req.params;

    if (!userId || !videoId) {
      return res.status(401).json({
        msg: "User id or video id is missing",
      });
    }

    if (!title) {
      return res.status(400).json({
        msg: "Title is missing",
      });
    }

    if (categoryId) {
      const isCategoryExists = await db
        .select({ id: categories.id })
        .from(categories)
        .where(eq(categories.id, categoryId));

      if (!isCategoryExists.length) {
        return res.status(404).json({
          msg: "Category not found",
        });
      }
    }

    const isVideoUpdated = await db
      .update(videos)
      .set({
        title,
        description,
        categoryId,
        visibility,
        updatedAt: sql`NOW()`,
      })
      .where(and(eq(videos.id, videoId), eq(videos.userId, userId)));

    if (!isVideoUpdated.rowCount) {
      return res.status(400).json({
        msg: "Video update Unsuccessful",
      });
    }

    return res.status(200).json({
      msg: "Video update successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Something went wrong", error: err });
  }
}

export async function deleteUserStudioVideo(req: Request, res: Response) {
  try {
    const { userId } = req.body;
    const { videoId } = req.params;

    if (!userId || !videoId) {
      return res.status(401).json({
        msg: "User id or video id is missing",
      });
    }

    const isVideoDeleted = await db
      .delete(videos)
      .where(and(eq(videos.id, videoId), eq(videos.userId, userId)));

    if (!isVideoDeleted.rowCount) {
      return res.status(400).json({
        msg: "Video delete Unsuccessful",
      });
    }

    return res.status(200).json({
      msg: "Video delete successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Something went wrong", error: err });
  }
}
