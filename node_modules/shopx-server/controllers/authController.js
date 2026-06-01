import crypto from "crypto";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { clearRefreshCookie, generateTokens, setRefreshCookie, verifyRefreshToken } from "../utils/jwt.js";

const otpStore = new Map();

const authResponse = (res, user, statusCode = 200) => {
  const { accessToken, refreshToken } = generateTokens(user);
  setRefreshCookie(res, refreshToken);
  res.status(statusCode).json({ success: true, user, accessToken });
};

/**
 * Register a user and issue JWT credentials.
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role = "user" } = req.body;
  const normalizedRole = role === "seller" ? "seller" : "user";
  const user = await User.create({ name, email, password, role: normalizedRole });
  authResponse(res, user, 201);
});

/**
 * Authenticate a user and issue access plus refresh tokens.
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  authResponse(res, user);
});

/**
 * Clear the refresh cookie.
 */
export const logout = asyncHandler(async (_req, res) => {
  clearRefreshCookie(res);
  res.json({ success: true, message: "Logged out" });
});

/**
 * Rotate an access token using the httpOnly refresh cookie.
 */
export const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    throw new ApiError(401, "Refresh token missing");
  }

  const decoded = verifyRefreshToken(token);
  const user = await User.findById(decoded.id);

  if (!user) {
    throw new ApiError(401, "User no longer exists");
  }

  const { accessToken } = generateTokens(user);
  res.json({ success: true, user, accessToken });
});

/**
 * Generate a short-lived password reset OTP.
 */
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const otp = crypto.randomInt(100000, 999999).toString();
  otpStore.set(email, {
    otp,
    expiresAt: Date.now() + 10 * 60 * 1000
  });

  res.json({
    success: true,
    message: "Password reset OTP generated",
    devOtp: process.env.NODE_ENV === "production" ? undefined : otp
  });
});

/**
 * Reset a password after OTP verification.
 */
export const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, password } = req.body;
  const record = otpStore.get(email);

  if (!record || record.otp !== otp || record.expiresAt < Date.now()) {
    throw new ApiError(400, "Invalid or expired OTP");
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.password = password;
  await user.save();
  otpStore.delete(email);

  res.json({ success: true, message: "Password reset successful" });
});
