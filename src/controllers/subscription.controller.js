// import { Subscription } from "../models/subscription.model.js";
// import { User } from "../models/user.model.js";
// import { ApiError } from "../utils/apiErrors.js";
// import { ApiResponse } from "../utils/apiResponse.js";
// import { asyncHandler } from "../utils/asyncHandler.js";

// const subscribe = asyncHandler(async (req, res) => {


//   const { channelId } = req.body;
//   const chanel = await User.findById(channelId);
//   if (!chanel) {
//     throw new ApiError(404, "Channel not found");
//   }


//   const user = await User.findById(req.user._id);
//   if (!user) {
//     throw new ApiError(404, "User not found");
//   }
//   console.log("user who subscribe " , user )
//   console.log("chanel who subscribed " , chanel)


//   const newSubscribe = await Subscription.create({
//     subscriber: user._id,
//     channel: chanel._id,
//   })


//   console.log("new subscribe " , newSubscribe)

  
 


//   return res.status(200)
//   .json(new ApiResponse(200, {data: chanel}, "Subscribed successfully"))

// });

// export { subscribe };



import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/apiErrors.js"
import {ApiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel id")
    } 
   

})


// cntroller to subscribe a chanel 

const subscribeChannel = asyncHandler(async (req, res) => {
  try {
    const { channelId } = req.params;

    if (!isValidObjectId(channelId)) {
      throw new ApiError(400, "Invalid channel id");
    }

    const channel = await User.findById(channelId);
    if (!channel) {
      throw new ApiError(404, "Channel not found");
    }



    const subscriber = await Subscription.create({
      subscriber: req.user._id,
      channel: channel._id
    });

    return res
      .status(200)
      .json(new ApiResponse(200, subscriber, "Subscribed successfully"));

  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, error, "Internal server error"));
  }
});



// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params;
    try {
        if (!isValidObjectId(channelId)) {
            throw new ApiError(400, "Invalid channel id")
        }
        const subscribers = await Subscription.find({channel: channelId}).populate("subscriber")
        if (!subscribers) {
            throw new ApiError(404, "No subscribers found")
        }
        return res.status(200).json(new ApiResponse(200, subscribers, "Subscribers fetched successfully"))
      
    } catch (error) {
      return res.status(500).json(new ApiResponse(500, error, "Internal server error"))
    }
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
 const { subscriberId }=req.user._id
  console.log("subscriber id " , subscriberId)

  // const subscribedChannels = await Subscription.find({ subscriber: new mongoose.Types.ObjectId(subscriberId) })

  // console.log("subscribed channels" , subscribedChannels) 
  
 
})

export {
    toggleSubscription,
    subscribeChannel,
    getUserChannelSubscribers,
    getSubscribedChannels
}