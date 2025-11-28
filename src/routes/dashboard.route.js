import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getChannelStats, getChannelVideos } from "../controllers/dashboard.controller.js";

const dashRouter = Router();

dashRouter.use(verifyJWT);


dashRouter.route("/getChannelStats").get(getChannelStats);
dashRouter.route("/getChannelVideos").get(getChannelVideos);


export default dashRouter;

