import { Router } from "express";

import { authorize, isAuth } from "../middlewares/auth";
import {
  createBranch,
  deleteBranch,
  getBranchById,
  getBranches,
  updateBranch,
} from "../controllers/branches";

const router = Router();

router.route("/").get(getBranches);
router.route("/:id").get(getBranchById);
router.route("/").post(isAuth, authorize("admin"), createBranch);
router.route("/:id").delete(isAuth, authorize("admin"), deleteBranch);
router.route("/:id").put(isAuth, authorize("admin"), updateBranch);

export default router;
