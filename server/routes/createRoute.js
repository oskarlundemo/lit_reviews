


const {Router} = require('express')
const {createUser} = require("../prisma");
const createRoute = new Router();


createRoute.post('/', async (req, res) => {
    const user = {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
    }
    await createUser(user)
})



module.exports = createRoute;