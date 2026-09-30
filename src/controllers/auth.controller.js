import env from "../config/env.config.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/util.jwt.js";
import { AppError } from "../utils/utils.AppError.js";
import { catchAsync } from "../utils/utils.catchAsync.js";


const usersDB = [
    {
        id: 1,
        name: "smith",
        email: "smith@gmail.com",
        password: "smith1234",
        role: "admin"
    },
    {
        id: 1,
        name: "jasmin",
        email: "jasmin@gmail.com",
        password: "jasmin1234",
        role: "developer"
    }
]

export const UserAuthentication = {
    login: catchAsync(async(req, res, next) => {
        const {email, password} = req.body;
        const user = usersDB.find(user => user.email === email && user.password === password);
        if(!user) {
            return next(new AppError("Invalid user credentials.", 401));
        }
    
        const payload = {id: user.id, role: user.role};
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);
    
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: env.NODE_DEV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
    
        res.status(200).json({
            success: true,
            message: "login successfully.",
            data: accessToken,
        });
    }),
    refreshToken: catchAsync(async(req, res, next) => {
        const refreshToken = req.cookies.refreshToken;
    
        if(!refreshToken) {
            return next(new AppError("No refresh token in payload.", 401));
        }
    
        try {
            const decoded = verifyRefreshToken(refreshToken);
            const payload = {id: decoded.id, role: decoded.role};
            const newAccessToken = generateAccessToken(payload);
            res.status(200).json({
                success: true,
                message: "Access token transmitted successfully.",
                data: newAccessToken
            });
        } catch(error) {
            next(new AppError("Invalid refresh token.", 401));
        }
    }),
}
