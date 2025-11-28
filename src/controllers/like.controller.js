import mongoose, { isValidObjectId } from "mongoose";
import { ApiError } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Like } from "../models/like.model.js";
import { Comment } from "../models/comment.model.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: toggle like on video
  try {
    if (!isValidObjectId(videoId)) {
      throw new ApiError(400, "Invalid video id");
    }

    const alreadyLiked = await Like.findOne({
      likedBy: req.user._id,
      video: videoId,
    });
    console.log("already like video ", alreadyLiked);

    if (alreadyLiked) {
      await Like.findByIdAndDelete(alreadyLiked._id);
      return res
        .status(200)
        .json(new ApiResponse(200, {}, "Video unliked successfully"));
    }

    const likeVideo = await Like.create({
      video: videoId,
      likedBy: req.user._id,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, likeVideo, "Video liked successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          error,
          "Something went wrong while toggling video like"
        )
      );
  }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  //TODO: toggle like on comment

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res
        .status(404)
        .json(new ApiResponse(404, {}, "Comment not found"));
    }
    const alreadyCommnetLiked = await Like.findOne({
      likedBy: req.user._id,
      comment: commentId,
    });
    if (alreadyCommnetLiked) {
      await Like.findByIdAndDelete(alreadyCommnetLiked._id);
      return res
        .status(200)
        .json(new ApiResponse(200, {}, "Comment unliked successfully"));
    }

    const commentLike = await Like.create({
      comment: commentId,
      likedBy: req.user._id,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, commentLike, "Comment liked successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          error,
          "Something went wrong while toggling comment like"
        )
      );
  }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  //TODO: toggle like on tweet
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
  try {
    //     const allLikedVideos = await Like.find({
    //       likedBy: req.user._id,
    //       video: { $exists: true },
    //     }).populate("video");
    //   return res.status(200).json(new ApiResponse(200, allLikedVideos, "All liked videos fetched successfully"));

    const allLikedVideos = await Like.aggregate([
      {
        $match: {
          likedBy: new mongoose.Types.ObjectId(req.user._id),
          video: { $exists: true },
        },
      },
      {
        $lookup: {
          from: "videos",
          localField: "video",
          foreignField: "_id",
          as: "likedVideo",
        },
      },
      {
        $unwind: "$likedVideo",
      },
      {
        $project: {
          _id: 0,
          //  "likedVideo.title": 1,
          //   "likedVideo.description": 1

          likeVideo: {
            title: "$likedVideo.title",
            description: "$likedVideo.description",
            videoOwner: "$likedVideo.videoOwner",
          },


        },
      },
    ]);
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          allLikedVideos,
          "All liked videos fetched successfully"
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          error,
          "Something went wrong while getting all liked videos"
        )
      );
  }
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
