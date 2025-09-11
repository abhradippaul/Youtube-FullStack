import { Request, Response } from "express";
import { pool } from "../db";
import { v4 as uuidv4 } from "uuid";
import { deleteRedisKey } from "../utils/redis";
import {
  decrementCommentCountDDB,
  incrementCommentCountDDB,
} from "../utils/handle-video";

export async function createComment(req: Request, res: Response) {
  try {
    const { id, username, description } = req.body;
    const { id: videoId } = req.params;

    if (!id || !username || !description) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    if (!videoId) {
      return res.status(400).json({ msg: "Video ID is required" });
    }

    const isUserAndVideoExist = await pool.query(
      `SELECT * FROM videos JOIN users ON videos.owner_id=users.id WHERE videos.id = $1 AND users.id = $2`,
      [videoId, id]
    );

    if (!isUserAndVideoExist.rowCount) {
      return res.status(404).json({ msg: "User or Video not found" });
    }

    const isCommentCreated = await pool.query(
      `INSERT INTO comments (id, commenter_id, video_id, description) VALUES ($1, $2, $3, $4) RETURNING *;`,
      [uuidv4(), id, videoId, description]
    );

    if (!isCommentCreated.rowCount) {
      return res.status(500).json({ msg: "Failed to create comment" });
    }

    await deleteRedisKey(`video:${videoId}`);
    await incrementCommentCountDDB(videoId);

    res.status(200).json({
      msg: "Comment published successfully",
      data: isCommentCreated.rows[0],
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error", err });
  }
}

export async function updateComment(req: Request, res: Response) {
  try {
    const { videoId } = req.params;
    const { description, id: userId } = req.body;
    const { commentId } = req.query;

    if (!commentId || !description || !videoId || !userId) {
      return res.status(400).json({ msg: "Missing required fields" });
    }

    const isCommentExist = await pool.query(
      `SELECT * FROM comments WHERE id = $1 AND commenter_id = $2 AND video_id = $3`,
      [commentId, userId, videoId]
    );

    if (!isCommentExist.rowCount) {
      return res.status(404).json({ msg: "Comment not found" });
    }

    const isCommentUpdated = await pool.query(
      `UPDATE comments SET description = $1 WHERE id = $2`,
      [description, commentId]
    );

    if (!isCommentUpdated.rowCount) {
      return res.status(500).json({ msg: "Failed to update comment" });
    }

    await deleteRedisKey(`video:${videoId}`);

    res.status(200).json({
      msg: "Comment updated successfully",
      data: isCommentUpdated.rows[0],
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error", err });
  }
}

export async function deleteComment(req: Request, res: Response) {
  try {
    const { videoId } = req.params;
    const { id: userId } = req.body;
    const { commentId } = req.query;

    if (!commentId || !userId || !videoId) {
      return res.status(400).json({ msg: "Missing required fields" });
    }

    const isCommentDeleted = await pool.query(
      `DELETE FROM comments WHERE id = $1 AND commenter_id = $2 AND video_id = $3`,
      [commentId, userId, videoId]
    );

    if (!isCommentDeleted.rowCount) {
      return res.status(500).json({ msg: "Failed to delete comment" });
    }

    await deleteRedisKey(`video:${videoId}`);
    await decrementCommentCountDDB(videoId);

    res.status(200).json({
      msg: "Comment deleted successfully",
      data: isCommentDeleted.rows[0],
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error", err });
  }
}
