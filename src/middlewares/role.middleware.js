import { AppError } from "../utils/utils.AppError";


export const restrictTo = (...allowedRoles) => {
    return (req, res, next) => {
        if(!allowedRoles.includes(req.user.role)) {
            return new AppError("You are not authorized to access this content.", 401);
        }
        next();
    }
}



