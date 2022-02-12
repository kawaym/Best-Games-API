import { Router } from "express";
import {
  createFavorite,
  createInCart,
  deleteFavorite,
  deleteInCart,
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
authRouter.post("/favorites", createFavorite);
authRouter.delete("/favorites", deleteFavorite);

authRouter.get("/shopping", getUserInfo);
authRouter.post("/shopping", createInCart);
authRouter.delete("/shopping", deleteInCart);

export default authRouter;
