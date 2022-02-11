import { Router } from "express";
import {
  getUserInfo,
  login,
  registerUser,
} from "../controllers/authControllers.js";
import { validateLoginSchema } from "../middlewares/validateLoginSchema.js";
import { validateUserSchema } from "../middlewares/validateUserSchema.js";

const authRouter = Router();
authRouter.post("/login", validateLoginSchema, login);
authRouter.post("/register", validateUserSchema, registerUser);
authRouter.get("/favorites", getUserInfo);

export default authRouter;
