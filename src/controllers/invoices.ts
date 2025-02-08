import { AuthenticatedRequest } from "../middlewares/auth";
import { asyncHandler, myAsyncHandler } from "../utils/asyncHandler";
import MyError from "../utils/error";
import { v4 as uuid } from "uuid";
import { InvoiceModel } from "../models/invoice";
import { buildInvoiceObj } from "../utils/invoice";
import { CommonController } from "./common";
import { publicSelect } from "../utils/tools";

const controller = new CommonController(InvoiceModel, {
  defaultSelect: { createdBy: 0, updatedAt: 0 },
});

export const createInvoice = asyncHandler(
  async (req: AuthenticatedRequest, res) => {
    const { userId } = req;
    const { amount, description, method, refId, refType } = req.body;
    if (!amount || !description || !method || !refId || !refType)
      throw new MyError("Талбаруудыг бүтэн дамжуулна уу!");
    req.body.code = uuid();
    req.body.createdBy = userId;
    const invoice = await InvoiceModel.create(req.body);
    const data = await buildInvoiceObj(invoice, method);
    res.json({ status: "success", data });
  }
);

export const checkInvoice = asyncHandler(
  async (req: AuthenticatedRequest, res) => {
    const { userId } = req;
    const { id } = req.params;
    const invoice = await InvoiceModel.findById(id);
    if (!invoice) throw new MyError(`${id} id-тай нэхэмжлэл олдсонгүй.`);
    if (invoice.status != "success")
      throw new MyError("Төлбөр хүлээгдэж байна.", 403);
    const data = {
      status: invoice.status,
      message: "Нэхэмжлэл төлөгдсөн байна.",
      method: invoice.method,
      amount: invoice.amount,
      description: invoice.description,
    };
    res.json({ status: "success", data });
  }
);

export const approveInvoice = asyncHandler(async (req, res) => {
  const { method, id, code } = req.params;
  const invoice = await InvoiceModel.findOne({ method, id, code });
  if (!invoice) throw new MyError("Invoice олдсонгүй.", 404);
  if (invoice.status == "success")
    throw new MyError("Invoice аль хэдий нь төлөгдсөн байна.");
  invoice.status = "success";
  await invoice.save();
  switch (method) {
    case "qpay":
      res.json({ status: "success" });
      break;

    default:
      break;
  }
});

export const getInvoices = myAsyncHandler(controller.getMany);
export const deleteInvoice = myAsyncHandler(controller.delete);
export const updateInvoice = myAsyncHandler(controller.update);
