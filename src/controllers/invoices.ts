import { AuthenticatedRequest } from "../middlewares/auth";
import { asyncHandler, myAsyncHandler } from "../utils/asyncHandler";
import MyError from "../utils/error";
import { v4 as uuid } from "uuid";
import { InvoiceModel } from "../models/invoice";
import { CommonController } from "./common";
import { createPayments } from "../utils/payments";

const controller = new CommonController(InvoiceModel, {
  defaultSelect: { createdBy: 0, updatedAt: 0 },
});

export const createInvoice = asyncHandler(
  async (req: AuthenticatedRequest, res) => {
    const { userId } = req;
    const { amount, description, userId: customerId, partialAmount } = req.body;
    if (!amount || !description || !customerId)
      throw new MyError("Талбаруудыг бүтэн дамжуулна уу!");
    req.body.code = uuid();
    req.body.createdBy = userId;

    const invoice = await InvoiceModel.create(req.body);

    const payments = await createPayments({
      amount,
      partialAmount,
      invoiceId: invoice.id,
    });

    const data = { invoice, payments };
    res.json({ status: "success", data });
  }
);

export const getInvoice = asyncHandler(
  async (req: AuthenticatedRequest, res) => {
    const { id } = req.params;
    const data = await InvoiceModel.findById(id)
      .populate("payments")
      .populate("userId", "name");
    if (!data) throw new MyError("Нэхэмжлэл олдсонгүй", 404);
    res.json({ status: "success", data });
  }
);

export const getInvoices = myAsyncHandler(controller.getMany);
export const deleteInvoice = myAsyncHandler(controller.delete);
export const updateInvoice = myAsyncHandler(controller.update);

export const getInvoicesHistory = asyncHandler(
  async (req: AuthenticatedRequest, res) => {
    const { userId } = req.params;
    const data = await InvoiceModel.find({ userId })
      .populate("payments")
      .populate("userId", "firstname lastname name")
      .sort({ createdAt: -1 });
    res.json({ status: "success", data });
  }
);

export const getPendingInvoices = asyncHandler(
  async (req: AuthenticatedRequest, res) => {
    const { userId } = req.params;
    const data = await InvoiceModel.find({ userId })
      .populate("payments")
      .populate("userId", "name");

    if (data.length === 0) {
      res.json({ status: "success", data: [] });
      return;
    }
    const pendingInvoices = data.filter((invoice) => invoice.status !== "paid");
    res.json({ status: "success", data: pendingInvoices });
  }
);
