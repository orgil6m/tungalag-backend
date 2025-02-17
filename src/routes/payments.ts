import { Router } from "express";
import {
  payPayment,
  checkPayment,
  approvePayment,
} from "../controllers/payments";
import { isAuth } from "../middlewares/auth";

const router = Router();

router.route("/:id/pay").post(isAuth, payPayment);
router.route("/:id/check").post(isAuth, checkPayment);
router.route("/:method/:id/:code/approve").post(approvePayment);

export default router;
