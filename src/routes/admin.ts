import { Router } from "express";

import { authorize, isAuth } from "../middlewares/auth";

import { getAdminAnalytics } from "../controllers/admin";

const router = Router();

router.route("/analytics").get(isAuth, authorize("admin"), getAdminAnalytics);

export default router;
