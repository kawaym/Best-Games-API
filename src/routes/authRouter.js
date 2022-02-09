import { Router } from 'express';
import { login, registerUser } from '../controllers/authControllers.js';


const authRouter = Router();
authRouter.post('/login', login);
authRouter.post('/register', registerUser);

export default authRouter;