import jwt from "jsonwebtoken";

const accessExpiry = "15m";
const refreshExpiry = "7d";

/**
 * Generate access and refresh JWTs for a user.
 * @param {object} user Mongoose user document.
 * @returns {{accessToken: string, refreshToken: string}}
 */
export const generateTokens = (user) => {
  const payload = { id: user._id.toString(), role: user.role };
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: accessExpiry });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: refreshExpiry });
  return { accessToken, refreshToken };
};

/**
 * Attach the refresh token as an httpOnly cookie.
 * @param {object} res Express response.
 * @param {string} refreshToken Signed refresh token.
 */
export const setRefreshCookie = (res, refreshToken) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
};

/**
 * Clear the refresh token cookie.
 * @param {object} res Express response.
 */
export const clearRefreshCookie = (res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
  });
};

/**
 * Verify a refresh token using the refresh secret.
 * @param {string} token Refresh token.
 * @returns {object} Decoded JWT payload.
 */
export const verifyRefreshToken = (token) => jwt.verify(token, process.env.JWT_REFRESH_SECRET);
