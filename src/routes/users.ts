import { Router } from "express";
import { checkOtp, refreshAccessToken, reqOtp } from "../controllers/auth";
import {
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "../controllers/users";
const router = Router();

router.route("/").get(getUsers);
router.route("/:id").get(getUserById);
router.route("/:id").delete(deleteUser);
router.route("/:id").put(updateUser);

export default router;
