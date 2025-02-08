import { Router } from "express";
import { checkOtp, refreshAccessToken, reqOtp } from "../controllers/auth";
import { isAuth } from "../middlewares/auth";
const router = Router();

router.route("/req-otp").post(reqOtp);
router.route("/check-otp").post(checkOtp);
router.route("/refresh").post(isAuth, refreshAccessToken);

export default router;
