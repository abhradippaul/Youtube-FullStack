import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import { router as userRouter } from "./routes/user.route";
import { router as authRouter } from "./routes/auth.route";
import { router as videoRouter } from "./routes/video.route";
import { router as commentRouter } from "./routes/comment.route";
import { router as likeRouter } from "./routes/like.route";
import { router as subscribeRouter } from "./routes/subscribe.route";
import { pool } from "./db";
import { flushRedis } from "./utils/redis";
import { clerkMiddleware } from "@clerk/express";
import { clerkClient, requireAuth, getAuth } from "@clerk/express";

const app = express();
const PORT = process.env.PORT || 3000;
const db = drizzle(process.env.DATABASE_URL!);

app.use(cors());
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/user", userRouter);
app.use("/user/subscribe", subscribeRouter);
app.use("/auth", authRouter);
app.use("/video", videoRouter);
app.use("/comment", commentRouter);
app.use("/like", likeRouter);
app.use(clerkMiddleware());

app.get("/", async (req, res) => {
  pool.query(`SELECT * FROM users`, (err, result) => {
    if (err) {
      console.error("Error fetching users:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json(result.rows);
  });
});

app.delete("/delete-all-user", (req, res) => {
  pool.query(`DELETE FROM users`, (err, result) => {
    if (err) {
      console.error("Error deleting users:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    return res.status(200).json({ message: "All users deleted successfully" });
  });
});

app.delete("/redis", async (req, res) => {
  await flushRedis();
  return res
    .status(200)
    .json({ message: "All Redis data deleted successfully" });
});

pool
  .connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server connected successfully on port no", PORT);
    });
  })
  .catch((err) => {
    console.log("Error while connecting server ", err);
  });
