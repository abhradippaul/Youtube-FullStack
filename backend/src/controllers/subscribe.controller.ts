import { Request, Response } from "express";
import { db } from "../db/index";
import { subscriptions } from "../db/schema";
import { and, eq } from "drizzle-orm";
// import {
//   decrementSubscribeCountDDB,
//   incrementSubscribeCountDDB,
// } from "../utils/aws-ddb";

export async function addToSubscriberList(req: Request, res: Response) {
  try {
    const { userId: channelId } = req.params;
    const { id: userId } = req.body;

    if (!userId || !channelId) {
      return res.status(400).json({ msg: "Missing user or channel id" });
    }

    if (userId === channelId) {
      return res.status(400).json({
        msg: "You cannot subscribe your channel",
      });
    }

    const isSubscribed = await db.insert(subscriptions).values({
      creatorId: channelId,
      viewerId: userId,
    });

    if (!isSubscribed.rowCount) {
      return res.status(400).json({
        msg: "Subscription unsuccessful",
      });
    }

    return res.status(200).json({ msg: "Subscribed successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error", err });
  }
}

export async function removeFromSubscriberList(req: Request, res: Response) {
  try {
    const { userId: channelId } = req.params;
    const { id: userId } = req.body;

    if (!userId || !channelId) {
      return res.status(400).json({ msg: "Missing user or channel id" });
    }

    const isDeleted = await db
      .delete(subscriptions)
      .where(
        and(
          eq(subscriptions.creatorId, channelId),
          eq(subscriptions.viewerId, userId)
        )
      );

    if (!isDeleted.rowCount) {
      return res.status(400).json({
        msg: "Unubscription unsuccessful",
      });
    }

    return res.status(200).json({ msg: "Unubscribe successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server Error", err });
  }
}
