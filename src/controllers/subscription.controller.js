import { Subscription } from "../models/subscription.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const subscribe = asyncHandler(async (req, res) => {
  // get channel id
  // find the channel
  // check if user is subscribed
  // if subscribed then unsubscribe
  // if not subscribed then subscribe
  // return response

  const { channelId } = req.body;
  const chanel = await User.findById(channelId);
  if (!chanel) {
    throw new ApiError(404, "Channel not found");
  }


  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  console.log("user who subscribe " , user )
  console.log("chanel who subscribed " , chanel)


  const newSubscribe = await Subscription.create({
    subscriber: user._id,
    channel: chanel._id,
  })


  console.log("new subscribe " , newSubscribe)

  
 


  return res.status(200)
  .json(new ApiResponse(200, {data: chanel}, "Subscribed successfully"))

});

export { subscribe };
