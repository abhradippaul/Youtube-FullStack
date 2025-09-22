import { Request, Response } from "express";
import { db } from "../db/index";
import { videoReactions } from "../db/schema";
import { and, eq } from "drizzle-orm";

export async function toggleLike(req: Request, res: Response) {
  try {
    const { id: userId } = req.body;
    const { videoId } = req.params;

    if (!userId || !videoId) {
      res.status(400);
      return res.json({
        msg: "Video id or user id required",
      });
    }

    const reactionExists = await db
      .select()
      .from(videoReactions)
      .where(
        and(
          eq(videoReactions.userId, userId),
          eq(videoReactions.videoId, videoId)
        )
      );

    if (reactionExists.length) {
      await db
        .delete(videoReactions)
        .where(
          and(
            eq(videoReactions.userId, userId),
            eq(videoReactions.videoId, videoId)
          )
        );
      return res.status(200).json({
        msg: "Reaction removed successfully",
      });
    }

    const isLikeAdded = await db.insert(videoReactions).values({
      userId,
      videoId,
      type: "like",
    });

    if (!isLikeAdded.rowCount) {
      return res.status(400).json({
        msg: "Like not added",
      });
    }

    return res.status(201).json({
      msg: "Like added successfully",
    });
  } catch (err) {
    res.status(500);
    console.log(err);
    return res.json({
      msg: "Some thing went wrong",
      error: err,
    });
  }
}

export async function toggleDisLike(req: Request, res: Response) {
  try {
    const { id: userId } = req.body;
    const { videoId } = req.params;

    if (!userId || !videoId) {
      res.status(400);
      return res.json({
        msg: "Video id or user id required",
      });
    }

    const reactionExists = await db
      .select()
      .from(videoReactions)
      .where(
        and(
          eq(videoReactions.userId, userId),
          eq(videoReactions.videoId, videoId)
        )
      );

    if (reactionExists.length) {
      await db
        .delete(videoReactions)
        .where(
          and(
            eq(videoReactions.userId, userId),
            eq(videoReactions.videoId, videoId)
          )
        );
      return res.status(200).json({
        msg: "Reaction removed successfully",
      });
    }

    const isLikeAdded = await db.insert(videoReactions).values({
      userId,
      videoId,
      type: "dislike",
    });

    if (!isLikeAdded.rowCount) {
      return res.status(400).json({
        msg: "Dislike not added",
      });
    }

    return res.status(201).json({
      msg: "Dislike added successfully",
    });
  } catch (err) {
    res.status(500);
    console.log(err);
    return res.json({
      msg: "Some thing went wrong",
      error: err,
    });
  }
}
