import db from "../db.js";
import { v4 as uuid } from "uuid";

export async function getProducts(req, res) {
  const productsCollection = db.collection("products");
  const category = req.headers.category;

  const categoryExists = await productsCollection.find({ category: category });

  if (categoryExists.length === 0) {
    res.sendStatus(401);
    return;
  }

  const products = await productsCollection.find({ category }).toArray();
  if (!products) {
    res.sendStatus(404);
    return;
  }
  res.send(products).status(201);
}

export async function createProduct(req, res) {
  const productsCollection = db.collection("products");
  const category = req.body.category;

  const categoryExists = await productsCollection.find({ category: category });
  if (!categoryExists) {
    res.sendStatus(401);
    return;
  }

  const product = req.body.name;
  const productExists = await productsCollection.findOne({
    name: product,
  });
  if (productExists) {
    res.sendStatus(403);
    return;
  }

  try {
    const token = uuid();
    await productsCollection.insertOne({
      ...req.body,
      id: token,
    });
    res.sendStatus(201);
  } catch (error) {
    res.sendStatus(500);
  }
}
