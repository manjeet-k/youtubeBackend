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


export {app}