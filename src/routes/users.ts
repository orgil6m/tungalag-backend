import { Router } from "express";
import {
  createUser,
  deleteUser,
  getCustomers,
  getEmployees,
  getUserById,
  getUsers,
  getUsersBySearch,
  updateUser,
} from "../controllers/users";
import { authorize, isAuth } from "../middlewares/auth";

const router = Router();

router.route("/").get(isAuth, authorize("admin"), getUsers);

router.route("/customers").get(isAuth, authorize("admin"), getCustomers);
router.route("/employees").get(isAuth, authorize("admin"), getEmployees);

router
  .route("/search")
  .get(isAuth, authorize("admin", "employee"), getUsersBySearch);

router.route("/").post(isAuth, authorize("admin"), createUser);
router.route("/:id").get(isAuth, authorize("admin"), getUserById);
router.route("/:id").delete(isAuth, authorize("admin"), deleteUser);
router.route("/:id").put(isAuth, updateUser);

export default router;
