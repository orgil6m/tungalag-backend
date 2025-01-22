import { Router } from "express";
import errorRoutes from "../routes/error";

import authRoutes from "./auth";
import usersRoutes from "./users";
const router = Router();

const commonUrl = "/api/v1";
const buildUrl = (url: string) => commonUrl + url;

router.use(buildUrl("/auth"), authRoutes);
router.use(buildUrl("/users"), usersRoutes);
router.use("*", errorRoutes);

export default router;
