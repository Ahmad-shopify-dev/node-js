import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { userSchema } from "../validations/user.validation.js";
import { protectRequest } from "../middlewares/auth.middleware.js";
import { cacheMiddleware } from "../middlewares/cache.middleware.js";

const userRoutes = Router();

// GETTING DATA 
// userRoutes.get("/", protectRequest, UserController.getAllUsers);
userRoutes.get("/", cacheMiddleware(300), UserController.getAllUsers);
userRoutes.get("/:id", UserController.getUserById);

// ADDING AND UPDATING DATA
userRoutes.post("/register", validate(userSchema), UserController.createNewUser);

export default userRoutes;