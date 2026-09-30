import { Router } from "express";
import { UserAuthentication } from "../controllers/auth.controller.js";


const authRoutes = Router();

authRoutes.post("/login", UserAuthentication.login);
authRoutes.post("/refreshtoken", UserAuthentication.refreshToken)

export default authRoutes;