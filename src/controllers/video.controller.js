// import mongoose, {isValidObjectId} from "mongoose"
// import {User} from "../models/user.model.js"
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  // const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 3;
  const skip = (page - 1) * limit;

  try {
    // const allVideos = await Video.find({ videoOwner: req.user._id })
    //   .skip(skip)
    //   .limit(limit)
    //   .sort({ createdAt: -1 });
       const allVideos = await Video.aggregate([
      {
        $match: {
          videoOwner: req.user._id,
        },
      },
      {
        $lookup :{
          from :"users",
          foreignField:"_id",
          localField:"videoOwner",
          as:"videoOwnerDetails",
          pipeline:[
            {
              $project:{
                username:1,
                fullName:1,
                avatar:1,
              }
            }
          ]
        }

      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ])
console.log("all videos " , allVideos);
    if (allVideos.length < 1) {
      return res.status(404).json({ message: "no videos found of this user" });
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, allVideos, "all videos fatched successfully ")
      );
  } catch (error) {
    return res.status(500).json(new ApiError(500, "Internal server error"));
  }
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  // TODO: get video, upload to cloudinary, create video
  const videoFile = req.files?.videoFile[0]?.path;
  const thumbnailFile = req.files?.thumbnail[0]?.path;
  if (!videoFile) {
    throw new ApiError(400, "Video file is required");
  }

  const video = await uploadOnCloudinary(videoFile);
  const thumbnail = await uploadOnCloudinary(thumbnailFile);
  if (!video) {
    throw new ApiError(400, "Video file is required");
  }
  const videoUrl = video.url;
  const thumbnailUrl = thumbnail?.url;
  const videoDuration = video.duration;

  const ownerId = req.user._id;

  const newVideo = await Video.create({
    videoFile: videoUrl,
    thumbnail: thumbnailUrl || "",
    title,
    description,
    duration: videoDuration,
    videoOwner: ownerId,
  });

  return res
    .status(201)
    .json(new ApiResponse(200, newVideo, "Video published successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id
  try {
    const video = await Video.findById(videoId);
    if (!video) {
      throw new ApiError(404, "Video not found");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, video, "Video fetched successfully"));
  } catch (error) {
    return res.status(500).json(new ApiError(500, "Internal server error"));
  }
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail
  const { title, description } = req.body;

  try {
    const video = await Video.findByIdAndUpdate(
      videoId,
      {
        $set: {
          title,
          description,
        },
      },
      {
        new: true,
      }
    );
    return res
      .status(200)
      .json(new ApiResponse(200, video, "Video updated successfully"));
  } catch (error) {
    return res.status(500).json(new ApiError(500, "Internal server error"));
  }
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  try {
    const video = await Video.findById(videoId);
    if (!video) {
      throw new ApiError(404, "Video not found");
    }
    video.isPublished = !video.isPublished;
    await video.save();
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { isPublished: video.isPublished },
          "Video status updated successfully"
        )
      );
  } catch (error) {
    return res.status(500).json(new ApiError(500, "Internal server error"));
  }
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
