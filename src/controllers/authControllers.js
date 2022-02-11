import db from "../db.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

export async function login(req, res) {
  const user = req.body;

  const userFinded = await db
    .collection("users")
    .findOne({ email: user.email });
  console.log(userFinded);

  if (!userFinded) {
    res.status(401).send("");
    return;
  } else if (bcrypt.compareSync(user.password, userFinded.password)) {
    const token = uuid();
    await db
      .collection("sessions")
      .insertOne({ userId: userFinded._id, token });

    delete userFinded.password;
    res.send({ user: userFinded.email, token });
  } else {
    res.sendStatus(401);
  }
}

export async function registerUser(req, res) {
  const user = req.body;

  const userFinded = await db
    .collection("users")
    .findOne({ email: user.email });
  if (userFinded) {
    res.sendStatus(409);
    return;
  }
  try {
    const passwordHash = bcrypt.hashSync(user.password, 10);
    await db.collection("users").insertOne({
      ...user,
      password: passwordHash,
      shopping: [],
      favorits: [],
    });
    res.sendStatus(201);
  } catch {
    res.sendStatus(500);
  }
}

export async function getUserInfo(req, res) {
  const user = req.headers.user;
  const solicitedInfo = req.headers.info;
  if (!user || !solicitedInfo) {
    res.sendStatus(422);
    return;
  }

  const usersCollection = db.collection("users");
  console.log(user);
  const existingUser = await usersCollection.findOne({ email: user });
  if (!existingUser) {
    res.sendStatus(404);
    return;
  }

  if (solicitedInfo === "favorites") {
    const favorites = await existingUser.favorits;
    res.send(favorites).status(200);
  } else if (solicitedInfo === "cart") {
    const cart = await existingUser.shopping;
    res.send(cart).status(200);
  } else {
    res.sendStatus(422);
  }
}

export async function createFavorite(req, res) {
  const productsCollection = db.collection("products");
  const usersCollection = db.collection("users");

  const product = req.body;

  const existingProduct = await productsCollection.findOne({ id: product.id });
  if (!existingProduct) {
    res.sendStatus(422);
    return;
  }

  const existingUser = await usersCollection.findOne({ email: product.email });
  if (!existingUser) {
    res.sendStatus(422);
    return;
  }
  try {
    const alreadyFavorite =
      existingUser.favorits.filter((item) => item.id == existingProduct.id)
        .length > 0;
    if (alreadyFavorite) {
      res.sendStatus(401);
      return;
    }

    const newFavorits = existingUser.favorits;
    newFavorits.push(existingProduct);
    await usersCollection.replaceOne(
      { email: product.email },
      { ...existingUser, favorits: newFavorits }
    );
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function createInCart(req, res) {
  const productsCollection = db.collection("products");
  const usersCollection = db.collection("users");

  const product = req.body;
  console.log(product.id);

  const existingProduct = await productsCollection.findOne({ id: product.id });
  if (!existingProduct) {
    res.sendStatus(422);
    return;
  }

  const existingUser = await usersCollection.findOne({ email: product.email });
  if (!existingUser) {
    res.sendStatus(422);
    return;
  }
  try {
    const alreadyInCart =
      existingUser.shopping.filter((item) => item.id === existingProduct.id)
        .length > 0;
    if (alreadyInCart) {
      res.sendStatus(401);
      return;
    }

    const newCart = existingUser.shopping;
    newCart.push(existingProduct);
    await usersCollection.replaceOne(
      { email: product.email },
      { ...existingUser, shopping: newCart }
    );
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function deleteFavorite(req, res) {
  const productsCollection = db.collection("products");
  const usersCollection = db.collection("users");

  const product = req.body;
  const existingProduct = await productsCollection.findOne({ id: product.id });
  if (!existingProduct) {
    res.sendStatus(422);
    return;
  }

  const existingUser = await usersCollection.findOne({ email: product.email });
  if (!existingUser) {
    res.sendStatus(422);
    return;
  }
  try {
    const notFavorite =
      existingUser.favorits.filter((item) => item.id === existingProduct.id)
        .length === 0;
    if (notFavorite) {
      res.sendStatus(401);
      return;
    }

    const newFavorits = existingUser.favorits.filter((item) => {
      return item.id !== existingProduct.id;
    });
    await usersCollection.replaceOne(
      { email: product.email },
      { ...existingUser, favorits: newFavorits }
    );
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function deleteInCart(req, res) {
  const productsCollection = db.collection("products");
  const usersCollection = db.collection("users");

  const product = req.body;
  const existingProduct = await productsCollection.findOne({ id: product.id });
  if (!existingProduct) {
    res.sendStatus(422);
    return;
  }

  const existingUser = await usersCollection.findOne({ email: product.email });
  if (!existingUser) {
    res.sendStatus(422);
    return;
  }
  try {
    const notInCart =
      existingUser.shopping.filter((item) => item.id === existingProduct.id)
        .length === 0;
    if (notInCart) {
      res.sendStatus(401);
      return;
    }

    const newCart = existingUser.shopping.filter((item) => {
      return item.id !== existingProduct.id;
    });
    await usersCollection.replaceOne(
      { email: product.email },
      { ...existingUser, shopping: newCart }
    );
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
