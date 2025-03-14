

import {Router} from 'express';
const createBookReview = new Router();
import {saveFile} from '../controllers/supabaseController.js'
import { configureBookReview, validateBookReview} from '../controllers/writeBookReviewController.js';


import multer from "multer";
import {validationResult} from "express-validator";
const upload = multer()


/**
 *
 *
 */


createBookReview.post('/' , upload.single('thumbnail'), validateBookReview, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Fel i validator');
        return res.status(400).json({ errors: errors.array() });
    }
    await configureBookReview(req, res)
})

export default createBookReview;