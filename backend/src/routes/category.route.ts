import express from "express";
import { getCategories } from "../controllers/category.controller";

const router = express.Router();

router.route("/").get(getCategories);

export { router };
