import db from '../db.js';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

export async function login(req, res) {
    const user = req.body;

    const userFinded = await db.collection('users').findOne({ email: user.email });
    console.log(userFinded);

    if (!userFinded) {
        res.status(401).send('');
        return;

    } else if (bcrypt.compareSync(user.password, userFinded.password)) {
        const token = uuid();
        await db.collection('sessions').insertOne({ userId: userFinded._id, token });

        delete userFinded.password;
        res.send({ user: userFinded.email, token });
    } else {
        res.sendStatus(401);
    }
}

export async function registerUser(req, res) {
    const user = req.body;

    const userFinded = await db.collection('users').findOne({ email: user.email });
    if (userFinded) {
        res.sendStatus(409);
        return;
    }
    try {
        const passwordHash = bcrypt.hashSync(user.password, 10);
        await db.collection('users').insertOne({
            ...user, password: passwordHash, shopping: [], favorits: []
        });
        res.sendStatus(201);
    } catch {
        res.sendStatus(500);
    }
}