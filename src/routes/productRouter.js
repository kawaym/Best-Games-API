import { Router } from "express";
import {
  createProduct,
  getProducts,
} from "../controllers/productControllers.js";
import validateProductSchema from "../middlewares/validateProductSchema.js";

const productRouter = Router();
productRouter.get("/products", getProducts);
productRouter.post("/products", validateProductSchema, createProduct);

export default productRouter;
