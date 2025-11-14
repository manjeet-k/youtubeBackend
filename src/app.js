import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";   



const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"));
app.use(cookieParser());


// app.get("/",(req,res)=>{
//     res.send("hello world");
// }   )


// import routes
import userRoutes from "./routes/user.routes.js"


// route declaration 
app.use("/api/v1/users", userRoutes);

// improt subscribe route
import subscribeRoute from "./routes/subscribe.route.js";

app.use("/api/v1/subscribe", subscribeRoute);



// video routes


// import healthcheckRouter from "./routes/healthcheck.routes.js"
// import tweetRouter from "./routes/tweet.routes.js"
// import subscriptionRouter from "./routes/subscription.routes.js"
// import likeRouter from "./routes/like.routes.js"
// import playlistRouter from "./routes/playlist.routes.js"
// import dashboardRouter from "./routes/dashboard.routes.js"




import router from "./routes/video.route.js";
app.use("/api/v1/videos", router);

import CommentRouter from "./routes/comment.route.js";
app.use("/api/v1/comments", CommentRouter);


export {app}