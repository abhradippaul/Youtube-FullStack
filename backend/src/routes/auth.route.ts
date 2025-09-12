import express from "express";
// import {
//   forgotPassword,
//   loginUser,
//   logoutUser,
//   signupUser,
//   validateEmailCode,
// } from "../controllers/auth.controller";
import { signupUser } from "../controllers/auth.controller";
// import { uploadImage } from "../utils/multer";

const router = express.Router();

router.route("/signup").post(signupUser);
// router.route("/login").post(loginUser);
// router.route("/logout").post(logoutUser);
// router.route("/forgot-password").post(forgotPassword);
// router.route("/validate-emailcode").post(validateEmailCode);

export { router };
