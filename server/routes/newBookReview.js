

import {Router} from 'express';
const createBookReview = new Router();
import {saveFile} from '../controllers/supabaseController.js'
import { newBookReview } from '../controllers/writeBookReviewController.js';

import multer from "multer";
const upload = multer()

createBookReview.post('/' , upload.single('thumbnail'), async (req, res) => {
    console.log('Body:', req.body);
    console.log('File:', req.file);
    await newBookReview(req, res)
    await saveFile(req, res);
})

export default createBookReview;