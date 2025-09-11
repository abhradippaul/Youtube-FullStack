import express from "express";
import { verifyUserToken } from "../middlewares/user.middleware";
import { addLike, removeLike } from "../controllers/like.controller";

const router = express.Router();

router
  .route("/:videoId")
  .post(verifyUserToken, addLike)
  .delete(verifyUserToken, removeLike);

// router.route("/:videoId").get(verifyUserToken, checkLike);

export { router };
