


import {Router} from 'express';
import {createUser, uniqueEmail, uniqueUsername} from "../controllers/createUserController.js";
const createUserRoute = new Router();

import { body, validationResult } from 'express-validator';


export const validateUserInfo = [
    body('username')
        .trim()
        .isLength({ min: 3, max: 10})
        .withMessage('Username must be between 3 and 10 characters')
        .escape()
        .custom(async(username) => {
            await uniqueUsername(username);
            return true;
        }),

    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail()
        .custom(async (email) =>{
            await uniqueEmail(email);
            return true;
        }),

    body('password').custom((value, { req }) => {
        const hasSpecialChar = /[^A-Za-z0-9]/;
        const hasNumber = /\d/;

        if (!hasSpecialChar.test(value)) {
            throw new Error('Password must contain at least one special character');
        }

        if (!hasNumber.test(value)) {
            throw new Error('Password must contain at least one number');
        }
        return true;
    })
]

createUserRoute.post('/', validateUserInfo, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    createUser(req, res, next);
});


export default createUserRoute;