import { verifySession } from "../middlewares/user.middleware";
import {
  getUserStudioVideo,
  getUserStudioVideos,
  updateUserStudioVideo,
} from "../controllers/studio.controller";
import express from "express";

const router = express.Router();

router.route("/videos").get(verifySession, getUserStudioVideos);
router.route("/video/:videoId").get(verifySession, getUserStudioVideo);
router.route("/video/:videoId").patch(verifySession, updateUserStudioVideo);

export { router };
