

import mongoose from "mongoose";
import {asyncHandler} from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Video } from "../models/video.model.js";
import { Like } from "../models/like.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiErrors.js";

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
   try {
     const chanelId = req.user._id ;

      const chanel = await User.findById(chanelId);
     
     const totalSubscriber = await Subscription.find({channel:chanelId}).countDocuments();
     const totalVideo = await Video.find({videoOwner:chanelId}).countDocuments();
     const totalLikedByUser = await Like.find({likedBy:chanelId}).countDocuments();
     const userVideo = await Video.find({videoOwner:chanelId});
     const userVideoID= userVideo.map((video)=>video._id).toString();
     const totalUsersLikes = await Like.find({video:userVideoID}).countDocuments();
     
     const userChanelDetails = {
        userName : chanel.userName,
        totalSubscriber,
        totalVideo,
        totalLikedByUser,
        totalUsersLikes
     }
   

    return res.status(200).json(new ApiResponse(200,userChanelDetails,"Channel stats fetched successfully"))
   } catch (error) {
    return res.status(500).json(new ApiError(500, error.message))
   }
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    try {
        const chanelId = req.user._id ;
        const chanelVideos = await Video.find({videoOwner:chanelId});
        return res.status(200).json(new ApiResponse(200, chanelVideos, "Channel videos fetched successfully"))
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message))   
    }
})

export {
    getChannelStats, 
    getChannelVideos
    }