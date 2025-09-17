import { NextFunction, Request, Response } from "express";
import { validateJWTToken } from "../utils/jwt";
import { verifyUserSessionDDB } from "../utils/handle-session";

export async function verifyUserJWTToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const cookie = req.cookies;

  let sessionId;

  if (cookie["backend-cookie"]) {
    const { sessionId: id } = validateJWTToken(cookie["backend-cookie"]) as {
      sessionId: string;
      iat: number;
    };
    sessionId = id;
  } else {
    const { sessionId: id } = req.query;
    sessionId = id;
  }

  req.body = { ...req.body, sessionId };
  next();
}

export async function verifySession(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { sessionId } = req.query;
  console.log(sessionId);

  if (!sessionId) {
    return res.status(401).json({
      msg: "Session not found",
    });
  }

  const verifySession = await verifyUserSessionDDB(String(sessionId));

  if (!verifySession?.Item?.clerk_id || !verifySession?.Item?.user_id) {
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
