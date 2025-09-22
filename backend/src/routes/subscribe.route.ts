import express from "express";
import { verifySession } from "../middlewares/user.middleware";
import {
  addToSubscriberList,
  removeFromSubscriberList,
} from "../controllers/subscribe.controller";

const router = express.Router();

router.route("/:userId").post(verifySession, addToSubscriberList);

router.route("/:userId").delete(verifySession, removeFromSubscriberList);

export { router };
