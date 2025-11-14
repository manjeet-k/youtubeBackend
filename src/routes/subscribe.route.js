import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getSubscribedChannels, getUserChannelSubscribers, subscribeChannel } from "../controllers/subscription.controller.js";


const subscribeRoute = Router();

subscribeRoute.route("/subscriber/:channelId").post(verifyJWT, subscribeChannel);


subscribeRoute.route("/:channelId").get(verifyJWT,getUserChannelSubscribers);
subscribeRoute.route("/subscribed").post(verifyJWT, getSubscribedChannels);

export default subscribeRoute;

