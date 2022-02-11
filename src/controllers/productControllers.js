import db from "../db.js";
import { v4 as uuid } from "uuid";

export async function getProducts(req, res) {
  const productsCollection = db.collection("products");
  const category = req.headers.category;

  const categoryExists = await productsCollection.find({ category: category });

  if (!categoryExists) {
    res.sendStatus(401);
    return;
  }

  const products = await productsCollection.find({ category }).toArray();
  res.send(products);
  if (!products) {
    res.sendStatus(404);
    return;
  }
}

export async function createProduct(req, res) {
  const productsCollection = db.collection("products");
  const category = req.body.category;

  const categoryExists = await productsCollection.find({ category: category });
  if (!categoryExists) {
    res.sendStatus(401);
    return;
  }

  const product = req.body.product;
  const productExists = await productsCollection.findOne({
    name: product.name,
  });
  if (productExists) {
    res.sendStatus(403);
    return;
  }

  try {
    const token = uuid();
    await productsCollection.insertOne({
      ...product,
      category,
      id: token,
    });
    res.sendStatus(201);
  } catch (error) {
    res.sendStatus(500);
  }
}
