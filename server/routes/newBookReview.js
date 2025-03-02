





const {Router} = require('express');
const createBookReview = new Router();
const {newBookReview, saveFile} = require("../prisma");

const multer  = require('multer')
const upload = multer()


createBookReview.post('/' , upload.single('thumbnail'), async (req, res) => {
    console.log('Body:', req.body);
    console.log('File:', req.file);
    await newBookReview(req, res)
    await saveFile(req, res);
})

module.exports = createBookReview;