import { Router } from "express";
import { checkOtp, refreshAccessToken, reqOtp } from "../controllers/auth";
const router = Router();

router.route("/req-otp").post(reqOtp);
router.route("/check-otp").post(checkOtp);
router.route("/refresh").get(refreshAccessToken);

export default router;
