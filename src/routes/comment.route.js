import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addComment, getallComment, getVideoComments, updateComment } from "../controllers/comment.controller.js";

 
const CommentRouter = Router();
CommentRouter.use(verifyJWT);


CommentRouter.route("/allComment").get(getallComment)
CommentRouter.route("/c/:videoId").get(getVideoComments);
CommentRouter.route("/createComment").post(addComment);
CommentRouter.route("/updateComment/:commentId").patch(updateComment);
// CommentRouter.route("/deleteComment/:commentId").delete(updateComment);


export default CommentRouter;
