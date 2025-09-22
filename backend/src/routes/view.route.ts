import express from "express";
import { getCategories } from "../controllers/view.controller";
import { verifySession } from "../middlewares/user.middleware";

const router = express.Router();

router.route("/:videoId").get(verifySession, getCategories);

export { router };
