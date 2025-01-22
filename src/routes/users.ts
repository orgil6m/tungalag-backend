import { Router } from "express";
import { checkOtp, refreshAccessToken, reqOtp } from "../controllers/auth";
import {
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "../controllers/users";
import { authorize, isAuth } from "../middlewares/auth";
const router = Router();

router.route("/").get(isAuth, authorize("admin"), getUsers);
router.route("/:id").get(isAuth, authorize("admin"), getUserById);
router.route("/:id").delete(isAuth, deleteUser);
router.route("/:id").put(isAuth, updateUser);

export default router;
