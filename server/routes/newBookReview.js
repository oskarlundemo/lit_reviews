





const {Router} = require('express');
const createBookReview = new Router();
const {newBookReview} = require("../prisma");
const {jwtDecode} = require("jwt-decode");


createBookReview.post('/' , async (req, res) => {
    try {
        await newBookReview(req, res)
    } catch (er) {
        console.error(er)
    }
})

module.exports = createBookReview;