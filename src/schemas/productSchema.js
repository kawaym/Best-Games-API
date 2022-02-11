import joi from "joi";

const productSchema = joi.object({
  name: joi.string().max(15).required(),
  price: joi.number().required(),
  description: joi.string().required(),
  image: joi.string().uri().required()
});

export default productSchema;
