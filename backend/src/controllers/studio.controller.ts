import { usersTable, videos } from "../db/schema";
import { db } from "../db";
import { Request, Response } from "express";
import { desc, eq } from "drizzle-orm";

export async function getUserStudioVideos(req: Request, res: Response) {
  try {
    const { pageParam: cursor = 0, limit = 5 } = req.query;

    // const { clerkId } = req.body;

    // if (!clerkId) {
    //   return res.status(401).json({
    //     msg: "id is missing",
    //   });
    // }

    // const data = await db
    //   .select()
    //   .from(usersTable)
    //   .innerJoin(videos, eq(usersTable.id, videos.userId))
    //   .where(eq(usersTable.clerkId, clerkId))
    //   .orderBy(desc(videos.createdAt))
    //   .offset(OFFSET)
    //   .limit(Number(limit) + 1);
    console.log(cursor, limit);
    const data = Array.from({ length: 100 })
      .map((_, i) => ({
        id: i,
        name: `Item ${i}`,
      }))
      .slice(Number(cursor), Number(cursor) + Number(limit) + 1);

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
