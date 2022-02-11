import db from "../db.js";
import jwt from 'jsonwebtoken';

export async function getProducts(req, res){
  const productsCollection = db.collection('products');
  const category = req.category;

  const categoryExists = await productsCollection.find({ category: category});

  if (!categoryExists){
    res.sendStatus(401);
    return;
  }

  const products = await productsCollection.findOne({category});
  console.log(products);
  if(!products){
    res.status(404).send('bananinha')
    return;
  }
}

export async function createProduct(req, res){
  const productsCollection = db.collection('products');
  const category = req.category;
  
  const categoryExists = await productsCollection.find({ category: category});
  if (!categoryExists){
    res.sendStatus(401);
    return;
  }
  
  const products = await productsCollection.findOne({category});
  if(!products){
    res.status(404).send('bananinha')
    return;
  }
  
  const product = req.product;
  const productExists = await productsCollection.find({ name: product.name });
  if (!productExists){
    res.sendStatus(401);
    return;
  }

}