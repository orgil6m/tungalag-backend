import { Router } from "express";
import {
  createInvoice,
  getInvoices,
  updateInvoice,
  deleteInvoice,
  getInvoice,
  getInvoicesHistory,
  getPendingInvoices,
} from "../controllers/invoices";
import { authorize, isAuth } from "../middlewares/auth";

const router = Router();

router.route("/").post(isAuth, createInvoice);

router.route("/").get(isAuth, authorize("admin"), getInvoices);

router.route("/:id").get(isAuth, getInvoice);

router.route("/:id").put(isAuth, authorize("admin", "employee"), updateInvoice);

router
  .route("/:id")
  .delete(isAuth, authorize("admin", "employee"), deleteInvoice);

router.route("/history/:userId").get(isAuth, getInvoicesHistory);
router.route("/history/:userId/pending").get(isAuth, getPendingInvoices);

export default router;
