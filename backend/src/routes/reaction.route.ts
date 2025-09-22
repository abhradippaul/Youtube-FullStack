import express from "express";
import { verifySession } from "../middlewares/user.middleware";
import { toggleDisLike, toggleLike } from "../controllers/reaction.controller";

const router = express.Router();

router.route("/:videoId/like").post(verifySession, toggleLike);

router.route("/:videoId/dislike").post(verifySession, toggleDisLike);

export { router };
