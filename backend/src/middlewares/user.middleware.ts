import { NextFunction, Request, Response } from "express";
import { validateToken } from "../utils/jwt";
import { verifyUserSessionDDB } from "../utils/handle-session";

export async function verifyUserToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const cookie = req.cookies;

  if (!cookie["user-auth"]) {
    res.status(404);
    return res.json({
      msg: "Cookie not found",
    });
  }

  const { username, id } = validateToken(cookie["user-auth"]) as {
    id: string;
    username: string;
    iat: number;
  };

  if (!username || !id) {
    res.status(404);
    return res.json({
      msg: "User is unauthenticated",
    });
  }

  req.body = { ...req.body, id, username };
  next();
}

export async function verifySession(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { sessionId } = req.query;

  if (!sessionId) {
    return res.status(401).json({
      msg: "Session does not exist",
    });
  }

  const verifySession = await verifyUserSessionDDB(String(sessionId));

  if (!verifySession?.Item?.clerk_id) {
    return res.status(404).json({
      msg: "User does not Exist",
    });
  }

  req.body = {
    ...req.body,
    clerkId: verifySession?.Item?.clerk_id,
    userId: verifySession?.Item?.user_id,
  };
  next();
}
