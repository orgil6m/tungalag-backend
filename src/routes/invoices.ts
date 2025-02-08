import { Router } from "express";
import {
  createInvoice,
  checkInvoice,
  approveInvoice,
  getInvoices,
  updateInvoice,
  deleteInvoice,
} from "../controllers/invoices";
import { authorize, isAuth } from "../middlewares/auth";

const router = Router();

router.route("/").post(isAuth, createInvoice);
router.route("/:id/check").get(isAuth, checkInvoice);
router.route("/:method/:id/:code/approve").get(approveInvoice);

router.route("/").get(isAuth, authorize("admin"), getInvoices);
router.route("/:id").put(isAuth, authorize("admin"), updateInvoice);
router.route("/:id").delete(isAuth, authorize("admin"), deleteInvoice);

export default router;
