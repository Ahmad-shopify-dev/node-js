import env from "../config/env.config.js";
import jwt from "jsonwebtoken";

// GENERATE ACCESS TOKEN
export const generateAccessToken = (payload) => {
    return jwt.sign(payload, env.data.JWT_ACCESS_SECRET, {
        expiresIn: env.data.JWT_ACCESS_EXPIRES_IN || '15m'
    });
}
  
// GENERATE REFRESH TOKEN
export const generateRefreshToken = (payload) => {
    return jwt.sign(payload, env.data.JWT_REFRESH_SECRET, {
        expiresIn: env.data.JWT_REFRESH_EXPIRES_IN || '7d'
    });
}

// VERIFY BOTH THE TOKENS
export const verifyAccessToken = (token) => {
    return jwt.verify(token, env.data.JWT_ACCESS_SECRET);
}

export const verifyRefreshToken = (token) => {
    return jwt.verify(token, env.data.JWT_REFRESH_SECRET);
}

