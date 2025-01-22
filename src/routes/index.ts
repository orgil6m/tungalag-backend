import { Router } from "express";
import errorRoutes from "../routes/error";
import sampleRoutes from "./sample";
const router = Router();

const commonUrl = "/api/v1";
const buildUrl = (url: string) => commonUrl + url;

router.use(buildUrl("/sample"), sampleRoutes);
router.use("*", errorRoutes);

export default router;
