import { usersTable } from "../db/schema";
import { db } from "../db/index";
import { Request, Response } from "express";
import { eq, sql } from "drizzle-orm";
import {
  createUserSessionDDB,
  deleteUserSessionDDB,
} from "../utils/handle-session";

export async function clerk(req: Request, res: Response) {
  try {
    const response = req.body;

    console.log(response);

    if (!response?.type) {
      res.status(400).json({
        msg: "Trigger type not found",
      });
    }

    const { data } = response;
    switch (response?.type) {
      case "session.created":
        if (!data?.user_id || !data?.id) {
          return res.status(400).json({
            msg: "Fields are required",
          });
        }
        await createUserSessionDDB(data.id, data.user_id);
        break;

      case "session.ended":
        if (!data?.id) {
          return res.status(400).json({
            msg: "Fields are required",
          });
        }
        await deleteUserSessionDDB(data.id);
        break;

      case "session.removed":
        if (!data?.id) {
          return res.status(400).json({
            msg: "Fields are required",
          });
        }
        await deleteUserSessionDDB(data.id);
        break;

      case "user.created":
        if (!data?.id || !data?.email_addresses[0]?.email_address) {
          return res.status(400).json({
            msg: "Fields are required",
          });
        }
        console.log("switch case running for create user");
        await db.insert(usersTable).values({
          clerkId: data.id,
          email: data.email_addresses[0].email_address,
          name: `${data?.first_name + " " + data?.last_name}`,
          username: data.email_addresses[0].email_address.split("@")[0],
        });
        break;

      case "user.updated":
        if (!data?.id) {
          return res.status(400).json({
            msg: "Fields are required",
          });
        }
        await db
          .update(usersTable)
          .set({
            avatarUrl: data?.image_url,
            name: `${data?.first_name + " " + data?.last_name}`,
            updatedAt: sql`NOW()`,
          })
          .where(eq(data.id, usersTable.clerkId));

      case "user.deleted":
        if (!data?.id || !data?.deleted) {
          return res.status(400).json({
            msg: "Fields are required",
          });
        }
        await db.delete(usersTable).where(eq(data.id, usersTable.clerkId));

      default:
        break;
    }

    return res.status(200).json({
      msg: "Fetched successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      msg: "Something went wrong",
      err,
    });
  }
}
