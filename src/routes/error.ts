import express, { Router } from "express";
import { errorPage } from "../controllers/error";
const router = Router();

router.route("/").get(errorPage);

export default router;
