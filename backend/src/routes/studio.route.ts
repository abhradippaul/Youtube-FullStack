import { verifySession } from "../middlewares/user.middleware";
import {
  deleteUserStudioVideo,
  getUserStudioVideo,
  getUserStudioVideos,
  updateUserStudioVideo,
} from "../controllers/studio.controller";
import express from "express";

const router = express.Router();

router.route("/videos").get(verifySession, getUserStudioVideos);
router
  .route("/video/:videoId")
  .get(verifySession, getUserStudioVideo)
  .patch(verifySession, updateUserStudioVideo)
  .delete(verifySession, deleteUserStudioVideo);

export { router };
