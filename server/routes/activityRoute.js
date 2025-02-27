


const {Router} = require("express");
const {banUserCommenting, getBannedUsers, unBanUserComments} = require("../prisma");


const activityRouter = Router();

activityRouter.get('/', async (req, res) => {
    await getBannedUsers(req, res);
})

activityRouter.post('/ban', async (req, res) => {
    await banUserCommenting(req, res)
})

activityRouter.post('/unban', async (req, res) => {
    await unBanUserComments(req, res)
})



module.exports = activityRouter