// import { verifySession } from "../middlewares/user.middleware";
import {
  getMuxUploadUrl,
  muxWebhook,
  //   getVideo,
  //   getVideoComments,
  //   getVideoHistory,
  //   getVideoInteraction,
  //   getVideoNumbers,
  //   getVideos,
  //   updateThumbnail,
  //   updateVideoInfo,
  //   uploadThumbnail,
  uploadVideo,
} from "../controllers/video.controller";
import express from "express";
import { verifySession } from "../middlewares/user.middleware";
import { uploadImage, videoUpload } from "../utils/multer";

const router = express.Router();

router
  .route("/")
  //   .get(getVideos)

  .post(
    videoUpload.fields([
      { name: "video", maxCount: 1 },
      { name: "thumbnail", maxCount: 1 },
    ]),
    verifySession,
    uploadVideo
  );

router.route("/mux-uploadurl").get(verifySession, getMuxUploadUrl);
router.route("/webhook").post(muxWebhook);

// router.route("/video-history").get(verifyUserToken, getVideoHistory);
// router.route("/:videoId").get(verifyUserToken, getVideo);
// router.route("/:id/videoinfo").patch(verifyUserToken, updateVideoInfo);
// router
//   .route("/:id/thumbnail")
//   .post(uploadImage.single("thumbnail"), verifyUserToken, uploadThumbnail)
//   .patch(uploadImage.single("thumbnail"), verifyUserToken, updateThumbnail);

// router.route("/:videoId/video-comments").get(verifyUserToken, getVideoComments);
// router.route("/:videoId/video-numbers").get(verifyUserToken, getVideoNumbers);
// router
//   .route("/:videoId/video-interact")
//   .get(verifyUserToken, getVideoInteraction);

export { router };
