import { UserService } from "../services/user.service.js";
import { AppError } from "../utils/utils.AppError.js";
import { catchAsync } from "../utils/utils.catchAsync.js";

// CONTROLLERS ARE USED TO AUTHENTICATE THINGS AND GET DATA FROM ANY SERVICE
export const UserController = {
    getAllUsers: async(req, res, next) => {
        try {
            const users = UserService.getUsers();
            if(users) {
                res.status(200).json({
                    status: "success",
                    data: users,
                    error: null
                })
            } else {
                res.status(200).json({
                    status: "success",
                    data: null,
                    error: "No users found!"
                })
            }
        } catch(error) {
            next(error);
        }
    },
    getUserById: async(req, res, next) => {
        const id = req.params.id;
        try {
            const user = UserService.findUserById(id);
            if(user) {
                res.status(200).json({
                    status: "success",
                    data: user,
                    error: null
                })
            } else {
                res.status(200).json({
                    status: "success",
                    data: null,
                    error: "No user found!"
                })
            }
        } catch(error) {
            next(error);
        }
    },
    createNewUser: catchAsync(async(req, res, next) => {
        if(!req.body) throw new AppError("No body content found. required data to create new user", 403);
        const newUser = req.body;
        const user = await UserService.addNewUser(newUser);
        if(user) {
            res.status(200).json({
                status: "success",
                data: user,
                error: null
            })
        } else {
            res.status(200).json({
                status: "false",
                data: null,
                error: "Unable to create new user!"
            })
        } 
    }),
}

 