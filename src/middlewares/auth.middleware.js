import { verifyAccessToken } from "../utils/util.jwt.js";
import { AppError } from "../utils/utils.AppError.js";
import { catchAsync } from "../utils/utils.catchAsync.js";


export const protectRequest = catchAsync(async(req, res, next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if(!token) {
        return next(new AppError("You are not logged in. Please login first to get access", 401))
    }

    try {
        const decoded = verifyAccessToken(token);
        req.user = decoded;
        next();
    } catch(error) {
        next(error)
    }
});
