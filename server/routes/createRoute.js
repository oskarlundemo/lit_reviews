


const {Router} = require('express')
const {createUser} = require("../prisma");
const createRoute = new Router();


createRoute.post('/', async (req, res) => {
    await createUser(req, res)
})



module.exports = createRoute;