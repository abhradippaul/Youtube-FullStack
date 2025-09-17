import jwt from "jsonwebtoken";

export function createJWTToken({ sessionId }: { sessionId: string }) {
  return jwt.sign({ sessionId }, "123");
}

export function validateJWTToken(token: string) {
  return jwt.verify(token, "123");
}
