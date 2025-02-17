import { AuthenticatedRequest } from "../middlewares/auth";
import { PaymentModel } from "../models/payments";
import { asyncHandler } from "../utils/asyncHandler";
import MyError from "../utils/error";
import { buildPaymentObj } from "../utils/payments";
import { checkQpayInvoice } from "../utils/qpay";

export const payPayment = asyncHandler(
  async (req: AuthenticatedRequest, res) => {
    const { id } = req.params;
    const payment = await PaymentModel.findById(id);
    if (!payment) throw new MyError(`${id} id-тай төлөлт олдсонгүй.`);

    if (payment.status == "paid")
      throw new MyError("Аль хэдий нь төлөгдсөн байна.");

    const { method } = req.body;
    if (!method) throw new MyError("Төлбөрийн хэрэгсэл сонгоно уу.", 400);
    const data = await buildPaymentObj(payment, method);
    res.json({ status: "success", data });
  }
);

export const checkPayment = asyncHandler(
  async (req: AuthenticatedRequest, res) => {
    const { id } = req.params;
    const payment = await PaymentModel.findById(id);
    if (!payment) throw new MyError(`${id} id-тай нэхэмжлэл олдсонгүй.`);

    if (payment.status != "paid")
      throw new MyError("Төлбөр хүлээгдэж байна.", 403);

    if (payment.qpay) {
      const res = await checkQpayInvoice(payment.qpay.invoice_id);
      console.log(res);
    }

    const data = {
      status: payment.status,
      message: "Нэхэмжлэл төлөгдсөн байна.",
      //   method: payment.method,
      amount: payment.amount,
      description: payment.description,
    };

    res.json({ status: "success", data });
  }
);

export const approvePayment = asyncHandler(async (req, res) => {
  const { method, id, code } = req.params;
  const payment = await PaymentModel.findOne({ method, id, code });
  if (!payment) throw new MyError("Төлөлтийн мэдээлэл олдсонгүй.", 404);
  if (payment.status == "paid")
    throw new MyError("Аль хэдий нь төлөгдсөн байна.");

  payment.status = "paid";

  await payment.save();
  switch (method) {
    case "qpay":
      res.json({ status: "success" });
      break;
    default:
      res.json({ status: "success" });
      break;
  }
});
