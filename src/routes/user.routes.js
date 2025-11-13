import { Router } from "express";
import {  changeCurrentPassword, getCurrentUser, getUserChanelProfile, getUserWatchHistory, refreshAccessToken, registerUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage, userLogin, userLogout } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(userLogin);


//  secured routes 
router.route("/logout").post(verifyJWT,userLogout);
router.route("/refresh-token").post(refreshAccessToken);

router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account").put(verifyJWT, updateAccountDetails);
router.route("/avatar").put(verifyJWT, upload.single("avatar"), updateUserAvatar);
router.route("/cover-image").put(verifyJWT, upload.single("coverImage"), updateUserCoverImage);
router.route("/getUserChanelProfile/:userName").get(verifyJWT, getUserChanelProfile);
router.route("/history").get(verifyJWT, getUserWatchHistory);


export default router;
