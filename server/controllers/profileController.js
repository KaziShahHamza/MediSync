// server/controllers/profileController.js

// Handles profile HTTP requests, responses, photo operations, and AI synchronization.

import {
  getUserProfile,
  findExistingProfile,
  updateUserName,
  createProfile,
  updateProfile,
  getSafeUser,
  updateProfilePhoto,
  findUserById,
  clearProfilePhoto,
} from "../services/profileService.js";

import {
  getProfileData,
  deleteProfilePhoto,
} from "../utils/profileHelpers.js";

import { syncProfileToAIChatData } from "../services/aiChatDataService.js";

// Returns the authenticated user's profile and safe user data.
export async function getProfile(req, res) {
  try {
    const { user, profile } = await getUserProfile(req.userId);

    return res.json({
      user,
      profile,
    });
  } catch (err) {
    console.error("Failed to fetch profile:", err);

    return res.status(500).json({
      message: "Failed to fetch profile",
    });
  }
}

// Creates a profile after checking for an existing profile.
export async function createProfileController(req, res) {
  try {
    const { name } = req.body;

    const profileData = getProfileData(req.body);

    // Prevent duplicate profiles for one user.
    const exists = await findExistingProfile(req.userId);

    if (exists) {
      return res.status(400).json({
        message: "Profile already exists",
      });
    }

    // Update the account name when supplied.
    await updateUserName(req.userId, name);

    const profile = await createProfile(req.userId, profileData);

    // Keep AI chat profile data synchronized.
    try {
      await syncProfileToAIChatData(req.userId);
    } catch (error) {
      console.error("Failed to sync profile to AI chat data:", error);
    }

    const user = await getSafeUser(req.userId);

    return res.status(201).json({
      user,
      profile,
    });
  } catch (err) {
    console.error("Failed to create profile:", err);

    return res.status(400).json({
      message: err.message,
    });
  }
}

// Updates profile fields and optionally updates the account name.
export async function updateProfileController(req, res) {
  try {
    const { name } = req.body;

    const profileData = getProfileData(req.body);

    // Update the account name when supplied.
    await updateUserName(req.userId, name);

    const profile = await updateProfile(req.userId, profileData);

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    // Keep AI chat profile data synchronized.
    try {
      await syncProfileToAIChatData(req.userId);
    } catch (error) {
      console.error("Failed to sync profile to AI chat data:", error);
    }

    const user = await getSafeUser(req.userId);

    return res.json({
      user,
      profile,
    });
  } catch (err) {
    console.error("Failed to update profile:", err);

    return res.status(400).json({
      message: err.message,
    });
  }
}

// Updates the authenticated user's profile photo metadata.
export async function updateProfilePhotoController(req, res) {
  try {
    const { profilePhotoUrl, profilePhotoPublicId } = req.body;

    if (!profilePhotoUrl || !profilePhotoPublicId) {
      return res.status(400).json({
        message: "Profile photo information is required.",
      });
    }

    const user = await updateProfilePhoto(
      req.userId,
      profilePhotoUrl,
      profilePhotoPublicId,
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    return res.json({
      message: "Profile photo updated successfully.",
      user,
    });
  } catch (err) {
    console.error("Failed to update profile photo:", err);

    return res.status(500).json({
      message: "Failed to update profile photo.",
    });
  }
}

// Removes the profile photo from Cloudinary and the user record.
export async function removeProfilePhotoController(req, res) {
  try {
    const user = await findUserById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    // Remove the remote Cloudinary image when available.
    if (user.profilePhotoPublicId) {
      try {
        await deleteProfilePhoto(user.profilePhotoPublicId);
      } catch (cloudinaryError) {
        console.error(
          "Failed to delete profile photo from Cloudinary:",
          cloudinaryError,
        );
      }
    }

    // Remove the photo metadata from the database.
    const safeUser = await clearProfilePhoto(user);

    return res.json({
      message: "Profile photo removed successfully.",
      user: safeUser,
    });
  } catch (err) {
    console.error("Failed to remove profile photo:", err);

    return res.status(500).json({
      message: "Failed to remove profile photo.",
    });
  }
}
