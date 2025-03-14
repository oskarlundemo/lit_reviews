


import {Router} from "express";


import {getAllReviews} from "../controllers/postController.js";
import {login} from "../controllers/loginController.js";
const loginRoute = new Router();


import { body, validationResult } from 'express-validator';


export const validateLoginInfo = [
    body('username')
        .trim()
        .isLength({ min: 3, max: 10})
        .escape()
        .withMessage('Invalid username or password'),
    body('password')
        .trim()
        .isLength({ min: 1, max: 100})
        .withMessage('Invalid username or password'),
];

loginRoute.get('/',getAllReviews)


loginRoute.post('/', validateLoginInfo, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({errors: errors.array()});
    }
    login(req, res);
})



export default loginRoute;