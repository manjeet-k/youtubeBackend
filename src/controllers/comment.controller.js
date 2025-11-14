import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/apiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import * as mongoose from "mongoose";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;

  try {
    const videoComment = await Comment.aggregate([
      {
        $match: {
          video: new mongoose.Types.ObjectId(videoId),
        },
      },
      {
        $lookup: {
          from: "videos",
          localField: "video",
          foreignField: "_id",
          as: "videoDetails",
          pipeline: [
            {
              $project: {
                title: 1,
              },
            },
          ],
        },
      },

      {
        $lookup:{
          from :"users",
          localField:"commentOwner",
         foreignField:"_id",
         as:"commentOwnerDetails",
         pipeline:[
          {
            $project:{
              userName:1,
              email:1
            }
          }
         ]
        }
      }
     
    ]);

    return res.status(200).json({
      statusCode: 200,
      data: videoComment,

      message: "Comments fetched successfully",
    });
  } catch (error) {
    console.log("eror", error);
    return res.status(500).json({
      statusCode: 500,
      data: null,
      message: error.message,
    });
  }
});

const getallComment = asyncHandler(async (req, res) => {
  try {
    // const allComment = await Comment.find()
    //   .populate("video", "title , description")
    //   .populate("commentOwner", "userName , email");


     const allComment = await Comment.aggregate([
      {
        $lookup:{
          from :"videos",
          localField:"video",
          foreignField:"_id",
          as:"videoDetails",
          pipeline:[
            {
              $project:{
                title:1,
                description:1
              }
            }
          ]
        }
      },
      {
        $lookup:{
          from:"users",
          localField:"commentOwner",
          foreignField:"_id",
          as:"commentOwnerDetails",
          pipeline:[
            {
              $project:{
                userName:1,
                email:1
              }
            }
          ]
        }
      }
     ])
    if (allComment.length < 1) {
      throw new ApiError(404, "No comments found");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, allComment, "All comments"));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, null, error.message));
  }
});

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video

  // const {videoId} = req.params
  const { videoId, content } = req.body;

  try {
    if (!videoId || !content) {
      throw new ApiError(400, "VideoId and content are required");
    }
    const newComment = await Comment.create({
      content: content,
      video: videoId,
      commentOwner: req.user._id,
    });
    return res
      .status(201)
      .json(new ApiResponse(201, newComment, "Comment added successfully"));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, null, error.message));
  }
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
  const { commentId } = req.params;
  try {
    const { content } = req.body;

    if (!commentId || !content) {
      throw new ApiError(400, "CommentId and content are required");
    }
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      {
        $set: {
          content: content,
        },
      },
      { new: true }
    );

    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedComment, "Comment updated successfully")
      );
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, null, error.message));
  }
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
});

export {
  getVideoComments,
  addComment,
  updateComment,
  deleteComment,
  getallComment,
};
