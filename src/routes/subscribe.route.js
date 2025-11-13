import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { subscribe } from "../controllers/subscription.controller.js";


const subscribeRoute = Router();

subscribeRoute.route("/subscriber").post(verifyJWT,subscribe);

export default subscribeRoute;

