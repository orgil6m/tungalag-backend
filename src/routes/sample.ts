import { Router } from "express";
import { sampleGet } from "../controllers/sample";
const router = Router();

router.route("/").get(sampleGet);

export default router;
