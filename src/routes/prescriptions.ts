import { Router } from "express";
import { checkOtp, refreshAccessToken, reqOtp } from "../controllers/auth";
import { authorize, isAuth } from "../middlewares/auth";
import {
  createPrescription,
  deletePrescription,
  getPrescriptionById,
  getPrescriptions,
  updatePrescription,
} from "../controllers/prescriptionController";
// import {
//   createPrescription,
//   deletePrescription,
//   getPrescriptionById,
//   getPrescriptions,
//   updatePrescription,
// } from "../controllers/prescriptions";
const router = Router();

router.route("/").get(isAuth, authorize("admin", "employee"), getPrescriptions);
router
  .route("/:id")
  .get(isAuth, authorize("admin", "employee"), getPrescriptionById);

router
  .route("/")
  .post(isAuth, authorize("admin", "employee"), createPrescription);

router.route("/:id").put(isAuth, updatePrescription);

router
  .route("/:id")
  .delete(isAuth, authorize("admin", "employee"), deletePrescription);

export default router;
