


import {Router} from "express";


import {getReviews} from "../controllers/postController.js";
import {login} from "../controllers/loginController.js";
const loginRoute = new Router();

loginRoute.get('/',getReviews)

loginRoute.post('/', login)



export default loginRoute;