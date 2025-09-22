// import fs from "fs";
import {
  subscriptions,
  usersTable,
  videoReactions,
  videos,
  videoViews,
} from "../db/schema";
import { db } from "../db";
import { Request, Response } from "express";
import { mux } from "../utils/mux";
import {
  createVideoUrlDDB,
  deleteVideoUploadUrlDDB,
  getVideoUploadUrlDDB,
  updateVideoUploadUrlDDB,
} from "../utils/handle-video-upload";
import {
  and,
  eq,
  getTableColumns,
  inArray as drizzleInArray,
  sql,
  isNotNull,
} from "drizzle-orm";
import { verifyUserSessionDDB } from "../utils/handle-session";
// import {
//   createVideoDDB,
//   getVideoDDB,
//   s3VideoDelete,
//   s3VideoUpload,
//   updateVideoViewCountDDB,
// } from "../utils/handle-video";
// import { v4 as uuidv4 } from "uuid";
// import { s3ImageDelete, s3ImageUpload } from "../utils/handle-image";
// import { sendMail } from "../utils/resend";
// import { getS3SignedUrl } from "../utils/aws-s3";
// // import { createRedisKey, deleteRedisKey, getRedisKey } from "../utils/redis";
// import { getUserDDB } from "../utils/aws-ddb";

const SIGNING_SECRET = process.env.MUX_WEBHOOK_SECRET!;

export async function getMuxUploadUrl(req: Request, res: Response) {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ msg: "User id is missing" });
    }

    let videoUploadInfo;

    const isUploadUrlExists = await getVideoUploadUrlDDB(userId);

    if (isUploadUrlExists.Item?.upload_id) {
      videoUploadInfo = {
        upload_url: isUploadUrlExists.Item?.upload_url,
        upload_id: isUploadUrlExists.Item?.upload_id,
      };
      console.log("Fetching from dynamodb");
    } else {
      const upload_info = await mux.video.uploads.create({
        cors_origin: "*",
        new_asset_settings: {
          passthrough: userId,
          playback_policy: ["public"],
          input: [
            {
              generated_subtitles: [
                {
                  language_code: "en",
                  name: "English",
                },
              ],
            },
          ],
        },
      });

      if (!upload_info.url || !upload_info.id) {
        return res.status(500).json({
          msg: "Video upload url or id not fetched",
        });
      }

      videoUploadInfo = {
        upload_url: upload_info.url,
        upload_id: upload_info.id,
      };

      if (Date.now() - isUploadUrlExists.Item?.created_at > 2000) {
        await updateVideoUploadUrlDDB(userId, upload_info.url);
      } else {
        await createVideoUrlDDB(upload_info.id, upload_info.url, userId);
      }
    }

    return res.status(200).json({
      msg: "Video upload url fetched successfully",
      ...videoUploadInfo,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Something went wrong", error: err });
  }
}

export async function uploadVideo(req: Request, res: Response) {
  try {
    const { userId, uploadId, title, description } = req.body;

    if (!userId || !uploadId) {
      return res.status(400).json({ msg: "User id or upload id is missing" });
    }

    if (!title || !description) {
      return res.status(400).json({ msg: "Missing title or description" });
    }

    const isVideoCreated = await db
      .insert(videos)
      .values({
        title,
        userId,
        description,
        muxUploadId: uploadId,
      })
      .returning();

    if (!isVideoCreated[0].id) {
      return res.status(400).json({
        msg: "Video create unsuccessful",
      });
    }

    await deleteVideoUploadUrlDDB(userId);

    return res.status(200).json({
      videoId: isVideoCreated[0].id,
      msg: "Video uploaded successfully",
    });
    //     const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    //     if (!files.video.length) {
    //       return res.status(400).json({ msg: "No video file uploaded" });
    //     }

    //     const isUserExist = await pool.query(
    //       `SELECT * FROM users WHERE id = $1 AND username = $2`,
    //       [id, username]
    //     );

    //     if (!isUserExist.rowCount) {
    //       return res.status(404).json({ msg: "User not found" });
    //     }

    //     const videoUrl = `videos/${isUserExist.rows[0].username}/${Date.now()}`;

    //     const isVideoUploaded = await s3VideoUpload(
    //       files.video[0],
    //       videoUrl,
    //       files.video[0].path
    //     );

    //     if (isVideoUploaded.$metadata.httpStatusCode !== 200) {
    //       return res
    //         .status(500)
    //         .json({ msg: "Error uploading video", error: isVideoUploaded });
    //     }

    //     const isVideoCreated = await pool.query(
    //       `INSERT INTO videos (id, owner_id, title, description, video_url, duration) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`,
    //       [uuidv4(), id, title, description, videoUrl, 123]
    //     );

    //     if (!isVideoCreated.rowCount) {
    //       return res
    //         .status(500)
    //         .json({ msg: "Error creating video", error: isVideoCreated });
    //     }

    //     fs.unlink(files.video[0].path, (err) => {
    //       if (err) {
    //         console.error("Error deleting video file:", err);
    //       }
    //     });

    //     await createVideoDDB(isVideoCreated.rows[0].id);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Something went wrong", error: err });
  }
}

export async function muxWebhook(req: Request, res: Response) {
  try {
    if (!SIGNING_SECRET) {
      return res.status(500).json({
        msg: "Mux webhook secret is missing",
      });
    }
    const muxSignature = req.header("mux-signature");
    if (!muxSignature) {
      return res.status(401).json({
        msg: "Mux signature is missing",
      });
    }

    const payload = req.body;
    console.log(payload);

    mux.webhooks.verifySignature(
      JSON.stringify(payload),
      {
        "mux-signature": muxSignature,
      },
      SIGNING_SECRET
    );

    const data = payload.data;

    if (!data) {
      return res.status(400).json({
        msg: "Video not found",
      });
    }

    switch (payload.type) {
      case "video.upload.asset_created":
        console.log(data);
        await db
          .update(videos)
          .set({
            muxAssetId: data.id,
            muxStatus: data.status,
          })
          .where(eq(videos.muxUploadId, data.upload_id));
        break;

      case "video.asset.ready":
        const playbackId = data.playback_ids[0].id;
        if (!playbackId || !data?.upload_id) {
          return res.status(500).json({
            msg: "Playback id or upload id is missing",
          });
        }
        const duration = data.duration ? Math.round(data.duration * 1000) : 0;

        await db
          .update(videos)
          .set({
            muxStatus: data.status,
            muxPlaybackId: playbackId,
            muxAssetId: data.id,
            duration,
          })
          .where(eq(videos.muxUploadId, data.upload_id));

        break;

      case "video.asset.error":
        if (!data?.upload_id) {
          return res.status(500).json({
            msg: "Upload id is missing",
          });
        }

        await db
          .update(videos)
          .set({
            muxStatus: data?.status,
          })
          .where(eq(videos.muxUploadId, data.upload_id));
        break;

      case "video.asset.deleted":
        if (!data?.upload_id) {
          return res.status(500).json({
            msg: "Upload id is missing",
          });
        }
        await db.delete(videos).where(eq(videos.muxUploadId, data.upload_id));
        break;

      case "video.asset.track.ready":
        const assetId = data?.asset_id;
        const trackId = data?.id;
        const status = data?.status;
        if (!assetId) {
          return res.status(500).json({
            msg: "Asset id is missing",
          });
        }

        await db
          .update(videos)
          .set({
            muxTrackId: trackId,
            muxTrackStatus: status,
          })
          .where(eq(videos.muxAssetId, assetId));
        break;
      default:
        break;
    }

    return res.status(200).json({
      msg: "Webhook recived",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Something went wrong", error: err });
  }
}

export async function getVideo(req: Request, res: Response) {
  try {
    const { videoId } = req.params;
    const { sessionId } = req.query;
    let userId = "";

    if (!videoId) {
      return res.status(400).json({ msg: "Missing video id" });
    }

    if (sessionId) {
      const verifySession = await verifyUserSessionDDB(String(sessionId));

      if (!verifySession?.Item?.clerk_id || !verifySession?.Item?.user_id) {
        return res.status(404).json({
          msg: "User does not Exist",
        });
      }

      userId = verifySession?.Item?.user_id;
    }

    const inArraySafe = (column: any, values: any) =>
      Array.isArray(values) && values.length === 0
        ? sql`false`
        : drizzleInArray(column, values);

    const viewerReactions = db.$with("viewer_reactions").as(
      db
        .select({
          videoId: videoReactions.videoId,
          type: videoReactions.type,
        })
        .from(videoReactions)
        .where(inArraySafe(videoReactions.userId, userId ? [userId] : []))
    );

    const viewerSubscriptions = db.$with("viewer_subscriptions").as(
      db
        .select()
        .from(subscriptions)
        .where(inArraySafe(subscriptions.viewerId, userId ? [userId] : []))
    );

    const videoInfo = await db
      .with(viewerReactions, viewerSubscriptions)
      .select({
        ...getTableColumns(videos),
        owner: {
          ...getTableColumns(usersTable),
          subscriberCount: db.$count(
            subscriptions,
            eq(subscriptions.creatorId, usersTable.id)
          ),
          isSubscribed: isNotNull(viewerSubscriptions.viewerId).mapWith(
            Boolean
          ),
        },

        viewCount: db.$count(videoViews, eq(videos.id, videoViews.videoId)),
        likeCount: db.$count(
          videoReactions,
          and(eq(videos.id, videoId), eq(videoReactions.type, "like"))
        ),
        disLikeCount: db.$count(
          videoReactions,
          and(eq(videos.id, videoId), eq(videoReactions.type, "dislike"))
        ),
        viewerReaction: viewerReactions.type,
      })
      .from(videos)
      .innerJoin(usersTable, eq(videos.userId, usersTable.id))
      .leftJoin(viewerReactions, eq(viewerReactions.videoId, videos.id))
      .leftJoin(
        viewerSubscriptions,
        eq(viewerSubscriptions.creatorId, usersTable.id)
      )
      .where(eq(videos.id, videoId))
      .groupBy(
        videos.id,
        usersTable.id,
        viewerReactions.type,
        viewerSubscriptions.viewerId
      );

    if (!videoInfo.length) {
      return res.status(400).json({
        msg: "Video not found",
      });
    }

    return res.json({
      msg: "Video found successfully",
      videoInfo,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Something went wrong", err: err });
  }
}

// export async function getVideoNumbers(req: Request, res: Response) {
//   try {
//     const { videoId } = req.params;
//     const { id: userId } = req.body;

//     if (!videoId || !userId) {
//       return res.status(400).json({ msg: "Missing video or user id" });
//     }

//     let responseDDB;
//     const isViewsExist = await pool.query(
//       `WITH
//       latest_view AS (
//       SELECT *,
//       EXTRACT(MINUTES FROM AGE(CURRENT_TIMESTAMP, created_at)) AS age_min
//       FROM views WHERE video_id = $1 AND user_id = $2
//       ORDER BY created_at DESC LIMIT 1
//       ),

//       video_info AS (
//       SELECT v.views, v.likes, v.comments, u.total_subs
//       FROM videos v JOIN users u ON v.owner_id = u.id
//       WHERE v.id = $1
//       )

//       SELECT l.id AS view_id,
//       l.age_min AS age_min,
//       v.views AS video_views,
//       v.likes AS video_likes,
//       v.comments AS video_comments,
//       v.total_subs AS user_totalsubs
//       FROM latest_view l
//       FULL JOIN video_info v ON true
//       `,
//       [videoId, userId]
//     );

//     if (isViewsExist?.rowCount && isViewsExist?.rows[0]?.age_min > 1) {
//       const isViewCreated = await pool.query(
//         `INSERT INTO views(id, user_id, video_id) VALUES($1, $2, $3)`,
//         [uuidv4(), userId, videoId]
//       );

//       if (!isViewCreated.rowCount) {
//         return res.status(500).json({
//           msg: "View update unsuccessful",
//         });
//       }

//       const data = await updateVideoViewCountDDB(videoId);
//       const user_info = await getUserDDB(userId);

//       responseDDB = {
//         views_count: data?.Attributes?.views,
//         comments_count: data?.Attributes?.comments,
//         likes_count: data?.Attributes?.likes,
//       };

//       await pool.query(
//         `UPDATE videos
//         SET views = $1, comments = $2, likes = $3 WHERE id = $4`,
//         [
//           responseDDB.views_count,
//           responseDDB.comments_count,
//           responseDDB.likes_count,
//           videoId,
//         ]
//       );

//       if (user_info.Item?.subscribers) {
//         await pool.query(`UPDATE users SET total_subs = $2 WHERE id = $1`, [
//           user_info.Item?.user_id,
//           user_info.Item?.subscribers,
//         ]);
//       }
//     } else if (isViewsExist?.rowCount && isViewsExist?.rows[0]?.age_min <= 1) {
//       responseDDB = {
//         views_count: isViewsExist?.rows[0]?.video_views,
//         comments_count: isViewsExist?.rows[0]?.video_comments,
//         likes_count: isViewsExist?.rows[0]?.video_likes,
//       };
//     } else {
//       const isViewCreated = await pool.query(
//         `INSERT INTO views(id, user_id, video_id) VALUES($1, $2, $3)`,
//         [uuidv4(), userId, videoId]
//       );
//       if (!isViewCreated.rowCount) {
//         return res.status(500).json({
//           msg: "View update unsuccessful",
//         });
//       }
//       const data = await updateVideoViewCountDDB(videoId);
//       responseDDB = {
//         views_count: data?.Attributes?.views,
//         comments_count: data?.Attributes?.comments,
//         likes_count: data?.Attributes?.likes,
//       };
//     }

//     return res.status(200).json({
//       video_numbers: isViewsExist.rows[0],
//       msg: "Fetched successfully",
//     });
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({ msg: "Something went wrong", err: err });
//   }
// }

// export async function getVideoInteraction(req: Request, res: Response) {
//   try {
//     const { videoId } = req.params;
//     const { id: userId = "" } = req.body;

//     if (!videoId || !userId) {
//       return res.status(400).json({
//         msg: "Video id, user id, username are required",
//       });
//     }

//     const isVideoLikedAndSubscribed = await pool.query(
//       `WITH
//         likes AS (
//           SELECT id FROM likes WHERE user_id = $1 AND video_id = $2 LIMIT 1
//         ),
//         is_liked AS (
//           SELECT EXISTS (
//             SELECT 1 FROM likes
//           ) AS value
//         ),
//         subscription AS (
//           SELECT id FROM subscriptions WHERE user_id = $1 AND channel_id = $1 LIMIT 1
//         ),
//         is_subscribed AS (
//           SELECT EXISTS (
//             SELECT 1 FROM subscription
//           ) AS value
//         )
//       SELECT
//         is_liked.value AS is_liked,
//         is_subscribed.value AS is_subscribed,
//         subscription.id AS subscription_id,
//         likes.id AS like_id
//       FROM likes
//       FULL JOIN is_liked ON TRUE
//       FULL JOIN subscription ON TRUE
//       FULL JOIN is_subscribed ON TRUE;
//       `,
//       [userId, videoId]
//     );

//     return res.status(200).json({
//       msg: "Like and subscribed successfully fetched",
//       ...isVideoLikedAndSubscribed.rows[0],
//     });
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({ msg: "Something went wrong", err: err });
//   }
// }

// export async function getVideoComments(req: Request, res: Response) {
//   try {
//     const { videoId } = req.params;
//     const { page = 0, limit = 5 } = req.query;

//     if (!videoId) {
//       return res.status(400).json({ msg: "Missing video id" });
//     }

//     let videoComments;
//     const OFFSET = Number(page) * Number(limit);
//     const COMMENT_LIMIT = (Number(page) + 1) * Number(limit);
//     // const videoCommentsStr = await getRedisKey(
//     //   `video:${videoId}:comments_page=${COMMENT_LIMIT}`
//     // );
//     const videoCommentsStr = false;

//     if (videoCommentsStr) {
//       console.log("Cache hit");
//       videoComments = JSON.parse(videoCommentsStr);
//     } else {
//       videoComments = await pool.query(
//         `SELECT
//       c.id AS comment_id,
//       c.description AS comment_description,
//       c.created_at AS comment_created,
//       u.username AS commenter_username,
//       u.avatar_url AS commenter_avatarurl,
//       u.id AS commenter_id
//       FROM comments c
//       JOIN videos v ON c.video_id = v.id
//       JOIN users u ON v.owner_id = u.id
//       WHERE c.video_id = $1 ORDER BY c.created_at DESC
//       LIMIT $3 OFFSET $2;`,
//         [videoId, OFFSET, COMMENT_LIMIT]
//       );

//       if (videoComments.rowCount) {
//         // await createRedisKey(
//         //   `video:${videoId}:comments_page=${COMMENT_LIMIT}`,
//         //   120,
//         //   JSON.stringify(videoComments)
//         // );
//       }
//     }

//     return res.status(200).json({
//       msg: "Fetched video engagement successfully",
//       page,
//       limit,
//       videoComments: videoComments.rows,
//     });
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({ msg: "Something went wrong", error: err });
//   }
// }

// export async function getVideoHistory(req: Request, res: Response) {
//   try {
//     const { id: userId } = req.body;
//     const { page = 0, limit = 5 } = req.query;

//     if (!userId) {
//       return res.status(400).json({ msg: "Missing user id" });
//     }

//     const OFFSET = Number(page) * Number(limit);
//     const COMMENT_LIMIT = (Number(page) + 1) * Number(limit);
//     let videoHistory;
//     // const videoHistoryStr = await getRedisKey(
//     //   `user:${userId}:video-history_page=${COMMENT_LIMIT}`
//     // );
//     const videoHistoryStr = false;

//     if (videoHistoryStr) {
//       console.log("Cache hit");
//       videoHistory = JSON.parse(videoHistoryStr);
//     } else {
//       const data = await pool.query(
//         `SELECT
//         v.id AS video_id,
//         v.title AS video_title,
//         v.thumbnail AS video_thumbnail,
//         u.full_name AS user_fullname,
//         v.owner_id AS user_id
//         FROM views w
//         JOIN videos v ON w.video_id = v.id
//         JOIN users u ON u.id = v.owner_id
//         WHERE w.user_id = $1 ORDER BY w.created_at DESC
//         LIMIT $3 OFFSET $2;`,
//         [userId, OFFSET, COMMENT_LIMIT]
//       );
//       videoHistory = data.rows;
//       if (data.rowCount) {
//         // await createRedisKey(
//         //   `user:${userId}:video-history_page=${COMMENT_LIMIT}`,
//         //   600,
//         //   JSON.stringify(videoHistory)
//         // );
//       }
//     }

//     return res.status(200).json({
//       msg: "Fetched video history successfully",
//       page,
//       limit,
//       video_history: videoHistory,
//     });
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({ msg: "Something went wrong", error: err });
//   }
// }

// export async function getVideos(req: Request, res: Response) {
//   try {
//     const videos = await pool.query(
//       `SELECT
//       v.id AS video_id,
//       v.title AS video_title,
//       v.thumbnail AS video_thumbnail,
//       EXTRACT(DAY FROM AGE(CURRENT_TIMESTAMP, v.created_at)) AS video_age,
//       u.full_name AS user_fullname,
//       u.avatar_url AS user_avatarurl
//       FROM videos v JOIN users u ON v.owner_id = u.id;`
//     );

//     return res
//       .status(200)
//       .json({ msg: "Video fetched successfully", videos: videos.rows });
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({ msg: "Something went wrong", error: err });
//   }
// }

// export async function uploadThumbnail(req: Request, res: Response) {
//   try {
//     const { id, username } = req.body;
//     const { id: videoId } = req.params;

//     if (!id || !username) {
//       return res.status(400).json({ msg: "Missing id or username" });
//     }

//     if (!videoId) {
//       return res.status(400).json({ msg: "Missing video id" });
//     }

//     const isUserAndVideoExist = await pool.query(
//       `SELECT * FROM users u JOIN videos v ON u.id = v.owner_id WHERE u.id = $1 AND u.username = $2 AND v.id = $3`,
//       [id, username, videoId]
//     );

//     if (!isUserAndVideoExist.rowCount) {
//       return res.status(404).json({ msg: "User or video not found" });
//     }

//     if (isUserAndVideoExist.rows[0].thumbnail) {
//       return res.status(400).json({ msg: "Thumbnail already exists" });
//     }

//     if (!req.file) {
//       return res.status(400).json({ msg: "No thumbnail file uploaded" });
//     }

//     const thumbnail_url = `thumbnail/${username}/${Date.now()}`;

//     const isThumbnailUploaded = await s3ImageUpload(req.file, thumbnail_url);

//     if (isThumbnailUploaded.$metadata.httpStatusCode !== 200) {
//       return res
//         .status(500)
//         .json({ msg: "Error uploading thumbnail", error: isThumbnailUploaded });
//     }

//     const isThumbnailUpdated = await pool.query(
//       `UPDATE videos SET thumbnail = $1 WHERE id = $2`,
//       [thumbnail_url, videoId]
//     );

//     if (!isThumbnailUpdated.rowCount) {
//       return res
//         .status(500)
//         .json({ msg: "Error updating thumbnail", error: isThumbnailUpdated });
//     }

//     // await deleteRedisKey(`video:${videoId}`);

//     return res.status(200).json({
//       msg: "Thumbnail uploaded successfully",
//     });
//   } catch (err) {
//     return res.status(500).json({ msg: "Something went wrong", error: err });
//   }
// }

// export async function updateThumbnail(req: Request, res: Response) {
//   try {
//     const { id: videoId } = req.params;
//     const { id, username } = req.body;

//     if (!id || !username) {
//       return res.status(400).json({ msg: "Missing id or username" });
//     }

//     if (!videoId) {
//       return res.status(400).json({ msg: "Missing video id" });
//     }

//     const isUserAndVideoExist = await pool.query(
//       `SELECT * FROM users u JOIN videos v ON u.id = v.owner_id WHERE u.id = $1 AND u.username = $2 AND v.id = $3`,
//       [id, username, videoId]
//     );

//     if (!isUserAndVideoExist.rowCount) {
//       return res.status(404).json({ msg: "User or video not found" });
//     }

//     if (!req.file) {
//       return res.status(400).json({ msg: "Missing thumbnail file" });
//     }

//     const thumbnail_url = `thumbnail/${username}/${Date.now()}`;

//     const isThumbnailUploaded = await s3ImageUpload(req.file, thumbnail_url);

//     if (isThumbnailUploaded.$metadata.httpStatusCode !== 200) {
//       return res
//         .status(500)
//         .json({ msg: "Error uploading thumbnail", error: isThumbnailUploaded });
//     }

//     const isThumbnailUpdated = await pool.query(
//       `UPDATE videos SET thumbnail = $1 WHERE id = $2`,
//       [thumbnail_url, videoId]
//     );

//     if (!isThumbnailUpdated.rowCount) {
//       return res
//         .status(500)
//         .json({ msg: "Error updating thumbnail", error: isThumbnailUpdated });
//     }

//     await s3ImageDelete(isUserAndVideoExist.rows[0].thumbnail);

//     // if (isImageDeleted.$metadata.httpStatusCode !== 200) {
//     //   return res
//     //     .status(500)
//     //     .json({ msg: "Error deleting old thumbnail", error: isImageDeleted });
//     // }

//     // await deleteRedisKey(`video:${videoId}`);

//     return res.status(200).json({ msg: "Thumbnail updated successfully" });
//   } catch (err) {
//     return res.status(500).json({ msg: "Something went wrong", err });
//   }
// }

// export async function updateVideoInfo(req: Request, res: Response) {
//   try {
//     const { id: videoId } = req.params;
//     const { title, description, id } = req.body;

//     if (!id) {
//       return res.status(400).json({ msg: "Missing id" });
//     }

//     if (!videoId || !title || !description) {
//       return res
//         .status(400)
//         .json({ msg: "Missing video id, title or description" });
//     }

//     const isUserAndVideoExist = await pool.query(
//       `SELECT * FROM videos WHERE id = $1 AND owner_id = $2`,
//       [videoId, id]
//     );

//     if (!isUserAndVideoExist.rowCount) {
//       return res.status(404).json({ msg: "User or video not found" });
//     }

//     const isVideoUpdated = await pool.query(
//       `UPDATE videos SET title = $1, description = $2 WHERE id = $3`,
//       [title, description, videoId]
//     );

//     if (!isVideoUpdated.rowCount) {
//       return res.status(500).json({ msg: "Failed to update video" });
//     }

//     // await deleteRedisKey(`video:${videoId}`);

//     res.status(200).json({ msg: "Video updated successfully" });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ msg: "Internal Server Error", err });
//   }
// }

// export async function deleteVideo(req: Request, res: Response) {
//   try {
//     const { id: videoId } = req.params;
//     const { id } = req.body;

//     if (!id) {
//       return res.status(400).json({ msg: "Missing id" });
//     }

//     if (!videoId) {
//       return res.status(400).json({ msg: "Missing video id" });
//     }

//     const isVideoDeleted = await pool.query(
//       `DELETE FROM videos WHERE id = $1 AND owner_id = $2 RETURNING *`,
//       [videoId, id]
//     );

//     if (!isVideoDeleted.rowCount) {
//       return res.status(500).json({ msg: "Failed to delete video" });
//     }

//     const isS3ThumbnailDeleted = await s3VideoDelete(
//       isVideoDeleted.rows[0].thumbnail
//     );

//     if (isS3ThumbnailDeleted.$metadata.httpStatusCode !== 200) {
//       return res.status(500).json({ msg: "Failed to delete video thumbnail" });
//     }

//     const isS3VideoDeleted = await s3VideoDelete(
//       isVideoDeleted.rows[0].video_url
//     );

//     if (isS3VideoDeleted.$metadata.httpStatusCode !== 200) {
//       return res.status(500).json({ msg: "Failed to delete video file" });
//     }

//     // await deleteRedisKey(`video:${videoId}`);

//     res.status(200).json({ msg: "Video deleted successfully" });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ msg: "Internal Server Error", err });
//   }
// }
