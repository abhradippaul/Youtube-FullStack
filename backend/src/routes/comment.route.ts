import express from "express";
import {
  createComment,
  deleteComment,
  updateComment,
} from "../controllers/comment.controller";
import { verifyUserToken } from "../middlewares/user.middleware";

const router = express.Router();

router.route("/:id").post(verifyUserToken, createComment);

router
  .route("/:videoId")
  .patch(verifyUserToken, updateComment)
  .delete(verifyUserToken, deleteComment);

export { router };
