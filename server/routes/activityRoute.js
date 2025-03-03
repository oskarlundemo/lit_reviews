

import { Router } from "express";
import { banUserCommenting, getBannedUsers, unBanUserComments } from "../controllers/activityController.js";

const activityRouter = Router();

activityRouter.get('/', getBannedUsers)

activityRouter.get('/banned', getBannedUsers)

activityRouter.post('/ban', banUserCommenting)

activityRouter.post('/unban', unBanUserComments)

export default activityRouter;
