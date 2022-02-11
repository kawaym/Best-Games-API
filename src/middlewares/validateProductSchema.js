import productSchema from "../schemas/productSchema.js";

export default function validateProductSchema(req, res, next) {
  const product = req.body.product;

  const validation = productSchema.validate(product);
  if (validation.error) {
    return res.sendStatus(422);
  }

  next();
}
