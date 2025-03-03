


import {Router} from 'express';
import {createUser} from "../controllers/createUserController.js";
const createUserRoute = new Router();


createUserRoute.post('/', createUser);


export default createUserRoute;