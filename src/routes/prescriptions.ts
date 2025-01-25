import { Router } from "express";
import { authorize, isAuth } from "../middlewares/auth";
import {
  createPrescription,
  deletePrescription,
  getPrescriptionById,
  getPrescriptions,
  getPrescriptionsHistory,
  updatePrescription,
} from "../controllers/prescriptions";

const router = Router();

router.route("/history").get(isAuth, getPrescriptionsHistory);

router.route("/").get(isAuth, authorize("admin", "employee"), getPrescriptions);

router
  .route("/:id")
  .get(isAuth, authorize("admin", "employee"), getPrescriptionById);

router
  .route("/")
  .post(isAuth, authorize("admin", "employee"), createPrescription);

router
  .route("/:id")
  .put(isAuth, authorize("admin", "employee"), updatePrescription);

router
  .route("/:id")
  .delete(isAuth, authorize("admin", "employee"), deletePrescription);

export default router;
