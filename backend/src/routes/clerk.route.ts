import express from "express";
import { clerk } from "../controllers/clerk.controller";

const router = express.Router();

router.route("/").post(clerk);

export { router };
