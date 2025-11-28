import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addVideoToPlaylist, createPlaylist, getPlaylistById, getUserPlaylists, removeVideoFromPlaylist, updatePlaylist } from "../controllers/playlist.controller.js";

const playlistRouter = Router();

playlistRouter.use(verifyJWT)
playlistRouter.route("/getPlaylists/:userId").get(getUserPlaylists);
playlistRouter.route("/create").post(createPlaylist);
playlistRouter.route("/addVideo").post(addVideoToPlaylist)
playlistRouter.route("/getPlaylistById/:playlistId").get(getPlaylistById)
playlistRouter.route("/removeVideo/:playlistId/:videoId").delete(removeVideoFromPlaylist)
playlistRouter.route("/update/:playlistId").patch(updatePlaylist)
export default playlistRouter;