// server/services/profileService.js

// Handles profile and user database operations for authenticated users.

import Profile from "../models/Profile.js";
import User from "../models/User.js";

// Fetches the safe user record and profile for a user.
export async function getUserProfile(userId) {
  const user = await User.findById(userId).select("-password");

  const profile = await Profile.findOne({
    user: userId,
  });

  return {
    user,
    profile: profile || null,
  };
}

// Checks whether the authenticated user already has a profile.
export async function findExistingProfile(userId) {
  return Profile.findOne({
    user: userId,
  });
}

// Updates the authenticated user's name.
export async function updateUserName(userId, name) {
  if (name?.trim()) {
    await User.findByIdAndUpdate(userId, {
      name: name.trim(),
    });
  }
}

// Creates a new profile for the authenticated user.
export async function createProfile(userId, profileData) {
  return Profile.create({
    ...profileData,
    user: userId,
  });
}

// Updates the authenticated user's profile.
export async function updateProfile(userId, profileData) {
  return Profile.findOneAndUpdate(
    {
      user: userId,
    },
    profileData,
    {
      new: true,
      runValidators: true,
    },
  );
}

// Fetches the safe user record after profile changes.
export async function getSafeUser(userId) {
  return User.findById(userId).select("-password");
}

// Updates the user's profile photo information.
export async function updateProfilePhoto(
  userId,
  profilePhotoUrl,
  profilePhotoPublicId,
) {
  return User.findByIdAndUpdate(
    userId,
    {
      profilePhotoUrl,
      profilePhotoPublicId,
    },
    {
      new: true,
      runValidators: true,
    },
  ).select("-password");
}

// Finds the user before removing their profile photo.
export async function findUserById(userId) {
  return User.findById(userId);
}

// Clears the stored profile photo information.
export async function clearProfilePhoto(user) {
  user.profilePhotoUrl = "";
  user.profilePhotoPublicId = "";

  await user.save();

  return User.findById(user._id).select("-password");
}
