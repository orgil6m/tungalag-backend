import { Router } from "express";
import errorRoutes from "../routes/error";

import authRoutes from "./auth";
import usersRoutes from "./users";
import branchesRoutes from "./branches";
import prescriptionsRoutes from "./prescriptions";
import invoicesRoutes from "./invoices";
const router = Router();

const commonUrl = "/api/v1";
const buildUrl = (url: string) => commonUrl + url;

router.use(buildUrl("/auth"), authRoutes);
router.use(buildUrl("/users"), usersRoutes);
router.use(buildUrl("/branches"), branchesRoutes);
router.use(buildUrl("/prescriptions"), prescriptionsRoutes);
router.use(buildUrl("/invoices"), invoicesRoutes);
router.use("*", errorRoutes);

export default router;
