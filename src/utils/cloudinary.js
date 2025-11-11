import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({ 
  cloud_name: "dwmy67gc7",
  api_key: "512684539958638",
  api_secret:"aP0K6bzTMUDWtYp7094Gh3sxfU4"
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.log("⚠️ No file path provided");
      return null;
    }

    console.log("📁 Attempting to upload file:", localFilePath);
    console.log("🔍 File exists:", fs.existsSync(localFilePath));

    // Upload file on Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log("✅ File uploaded on Cloudinary:", response.url);

    // Remove local temp file (after upload)
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return response;
  } catch (error) {
    console.error("❌ Cloudinary upload failed:", error.message);
    console.error("📁 Failed file path:", localFilePath);

    // Remove local file if it still exists
    if (fs.existsSync(localFilePath)) {
      console.log("🗑️ Cleaning up failed upload file:", localFilePath);
      fs.unlinkSync(localFilePath);
    }

    return null;
  }
};

export { uploadOnCloudinary };
