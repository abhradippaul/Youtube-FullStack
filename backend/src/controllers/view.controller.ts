import { Request, Response } from "express";
import { db } from "../db/index";
import { usersTable, videos, videoViews } from "../db/schema";
import { and, eq } from "drizzle-orm";

export async function getCategories(req: Request, res: Response) {
  try {
    const { id: userId } = req.body;
    const { videoId } = req.params;
    if (!videoId || !userId) {
      return res.status(401).json({
        msg: "Video id or user id not found",
      });
    }

    const isViewExist = await db
      .select()
      .from(videoViews)
      .where(and(eq(usersTable.id, userId), eq(videos.id, videoId)));
    if (isViewExist.length) {
      return res.status(200).json({
        msg: "Video view is already exist",
      });
    }
    const isVideoViewCreated = await db.insert(videoViews).values({
      userId,
      videoId,
    });

    if (!isVideoViewCreated.rowCount) {
      return res.status(400).json({
        msg: "Video view is not created",
      });
    }

    res.status(200).json({
      msg: "Video view created successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      err,
      msg: "Some thing went wrong",
    });
  }
}
