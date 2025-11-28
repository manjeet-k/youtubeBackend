import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Video } from "../models/video.model.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  //TODO: create playlist
  try {
    const alreadyPlaylist = await Playlist.findOne({ name: name });
    if (alreadyPlaylist) {
      return res.status(400).json(new ApiError(400, "Playlist already exists"));
    }
    const playlist = await Playlist.create({
      name: name,
      description: description,
      owner: req.user._id,
    });
    return res
      .status(201)
      .json(new ApiResponse(201, playlist, "Playlist created successfully"));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new ApiError(500, "Something went wrong while creating playlist"));
  }
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  //TODO: get user playlists
  try {
    if (!isValidObjectId(userId)) {
      throw new ApiError(400, "Invalid user id");
    }

    const playlists = await Playlist.find({ createdBy : userId });

    if(!playlists){
      throw new ApiError(404, "No playlists found");
    }
console.log("playlist" ,playlists)
    return res
      .status(200)
      .json(new ApiResponse(200, playlists, "Playlists fetched successfully"));
    
  } catch (error) {
    
  }
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  //TODO: get playlist by id
  try {
    if (!isValidObjectId(playlistId)) {
      throw new ApiError(400, "Invalid playlist id");
    }

    // const playlist = await Playlist.findById(playlistId).populate("videos" ,"title" );

    const playlist = await Playlist.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(playlistId),
        },
      },
      {
        $lookup: {
          from: "videos",
          localField: "videos",
          foreignField: "_id",
          as: "playlistVideos",
        },
      },
      {
        $unwind: "$playlistVideos",
      },
      {
        $project: {
          title: "$playlistVideos.title",
          description: "$playlistVideos.description",
          owner: "$playlistVideos.videoOwner",
        },
      },
    ]);

    return res
      .status(200)
      .json(new ApiResponse(200, playlist, "Playlist fetched successfully"));
  } catch (error) {
    console.log("error", error);
    return res
      .status(500)
      .json(new ApiError(500, "Something went wrong while getting playlist"));
  }
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.body;

  try {
    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      return res.status(404).json(new ApiError(404, "Playlist not found"));
    }

    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json(new ApiError(404, "Video not found"));
    }

    const existVideo = playlist.videos.some((id) => id.equals(videoId));
    if (existVideo) {
      return res
        .status(400)
        .json(new ApiError(400 , null , "video already exist in playlist "));
    }

    playlist.videos.push(videoId);
    await playlist.save();

    return res
      .status(200)
      .json(
        new ApiResponse(200, playlist, "Video added to playlist successfully")
      );
  } catch (error) {
    console.error("Error adding video to playlist:", error);
    return res
      .status(500)
      .json(
        new ApiError(500, "Something went wrong while adding video to playlist")
      );
  }
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  // TODO: remove video from playlist

  try {
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      throw new ApiError(404, "Playlist not found");
    }
    const video = await Video.findById(videoId);
    if (!video) {
      throw new ApiError(404, "Video not found");
    }
    playlist.videos.pull(videoId);
    await playlist.save();
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          playlist,
          "Video removed from playlist successfully"
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          "Something went wrong while removing video from playlist"
        )
      );
  }
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  // TODO: delete playlist
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
//   const { name, description } = req.body;
  //TODO: update playlist

  try {
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      throw new ApiError(404, "Playlist not found");
    }
    let uniquePlaylistVideos = [...new Set(playlist.videos.map(id => id.toString()))];

     playlist.videos = uniquePlaylistVideos;
     await playlist.save();
  
   

    return res
      .status(200)
      .json(new ApiResponse(200, playlist, "Playlist updated successfully"));
    
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Something went wrong while updating playlist"));
  }
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
