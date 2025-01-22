import { Router } from "express";
import { checkOtp, refreshAccessToken, reqOtp } from "../controllers/auth";
import {
  deleteUser,
  getPrescriptionHistory,
  getUserById,
  getUsers,
  updateUser,
} from "../controllers/userController";
import { authorize, isAuth } from "../middlewares/auth";

const router = Router();

router.route("/").get(isAuth, authorize("admin"), getUsers);
router.route("/:id").get(isAuth, authorize("admin"), getUserById);
router.route("/:id").delete(isAuth, authorize("admin"), deleteUser);
router.route("/:id").put(isAuth, updateUser);
router.route("/:id/prescriptions").get(isAuth, getPrescriptionHistory);

export default router;
