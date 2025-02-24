





const {Router} = require('express')
const {getReviews, inspectReview, deleteReview} = require("../prisma");


const postRoute = new Router();


postRoute.get('/', async (req, res) => {
    await getReviews(req, res);
})


postRoute.get('/:id', async (req, res) => {
    await inspectReview(req, res);
})


postRoute.delete('/:id', async (req, res) => {
    await deleteReview(req, res);
    await getReviews(req, res);
})

module.exports = postRoute