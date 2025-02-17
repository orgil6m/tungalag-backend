import { Router } from "express";
import {
  createInvoice,
  getInvoices,
  updateInvoice,
  deleteInvoice,
  getInvoice,
} from "../controllers/invoices";
import { authorize, isAuth } from "../middlewares/auth";

const router = Router();

router.route("/").post(isAuth, createInvoice);
router.route("/").get(isAuth, authorize("admin"), getInvoices);
router.route("/:id").get(isAuth, getInvoice);
router.route("/:id").put(isAuth, authorize("admin"), updateInvoice);
router.route("/:id").delete(isAuth, authorize("admin"), deleteInvoice);

export default router;
