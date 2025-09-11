import { Request, Response } from "express";
import { pool } from "../db";
import { v4 as uuidv4 } from "uuid";
import {
  decrementLikeCountDDB,
  incrementLikeCountDDB,
} from "../utils/handle-video";

export async function addLike(req: Request, res: Response) {
  try {
    const { id, username } = req.body;
    const { videoId } = req.params;

    if (!id || !username) {
      res.status(400);
      return res.json({
        msg: "Post ID and username are required",
      });
    }

    if (!videoId) {
      res.status(400);
      return res.json({
        msg: "Video ID is required",
      });
    }

    const isUserAndVideoExist = await pool.query(
      `WITH auth_user AS (
        SELECT *
        FROM users
        WHERE id = $1 AND username = $2 LIMIT 1
        ),
    video AS (
        SELECT *
        FROM videos
        WHERE id = $3 LIMIT 1
    ),
    user_like AS (
        SELECT *
        FROM likes
        WHERE video_id = $3 AND user_id = $1 LIMIT 1
    )
    SELECT (
        SELECT row_to_json(auth_user)
        FROM auth_user
    ) AS auth_user,
    (
        SELECT row_to_json(video)
        FROM video
    ) AS videos,
     (
        SELECT row_to_json(user_like)
        FROM user_like
    ) AS likes;`,
      [id, username, videoId]
    );

    if (isUserAndVideoExist.rows[0]?.likes?.id) {
      res.status(400);
      return res.json({
        msg: "Like already exists",
      });
    }

    if (
      !isUserAndVideoExist.rows[0]?.auth_user?.id ||
      !isUserAndVideoExist.rows[0]?.videos?.id
    ) {
      res.status(404);
      return res.json({
        msg: "User or Video not found",
      });
    }

    const isLikeAdded = await pool.query(
      `INSERT INTO likes (id, user_id, video_id) VALUES ($1, $2, $3) RETURNING *`,
      [uuidv4(), id, videoId]
    );

    if (!isLikeAdded.rowCount) {
      res.status(400);
      return res.json({
        msg: "Failed to add like",
      });
    }

    await incrementLikeCountDDB(videoId);

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

export async function removeLike(req: Request, res: Response) {
  try {
    const { id: userId } = req.body;
    const { videoId } = req.params;
    const { likeId } = req.query;

    if (!likeId || !userId || !videoId) {
      return res.status(400).json({
        msg: "Subscription id is required",
      });
    }

    const isLikeRemoved = await pool.query(
      `DELETE FROM likes WHERE id = $1 AND video_id = $2 AND user_id = $3`,
      [likeId, videoId, userId]
    );

    if (!isLikeRemoved.rowCount) {
      res.status(400);
      return res.json({
        msg: "Failed to remove like",
      });
    }

    await decrementLikeCountDDB(videoId);

    return res.status(200).json({
      msg: "Like removed successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      msg: "Some thing went wrong",
      error: err,
    });
  }
}
