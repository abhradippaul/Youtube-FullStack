import express from "express";
import {
  createComment,
  deleteComment,
  getComment,
  updateComment,
} from "../controllers/comment.controller";
import { verifySession } from "../middlewares/user.middleware";

const router = express.Router();

router.route("/:videoId").get(getComment);
router.route("/:videoId").post(verifySession, createComment);

router
  .route("/:videoId")
  .patch(verifySession, updateComment)
  .delete(verifySession, deleteComment);

export { router };
