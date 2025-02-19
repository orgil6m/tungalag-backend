import { ObjectId } from "mongoose";
import { baseUrl } from "../config/env";
import { Payment, PaymentModel } from "../models/payments";
import { createQpayInvoice } from "./qpay";
import { v4 as uuid } from "uuid";

export const createPayments = async ({
  invoiceId,
  amount,
  partialAmount,
}: {
  invoiceId: ObjectId;
  amount: number;
  partialAmount: number;
}) => {
  const payments = [];
  if (partialAmount && partialAmount > 100) {
    payments.push({
      amount: partialAmount,
      invoiceId,
      description: "Урьдчилгаа",
    });
    payments.push({
      amount: amount - partialAmount,
      invoiceId,
      description: "Үлдэгдэл",
    });
  } else {
    payments.push({
      amount,
      invoiceId,
      description: "Бүтэн төлөлт",
    });
  }

  return await PaymentModel.create(payments);
};

export const buildCallBackUrl = ({
  id,
  code,
  method = "qpay",
}: {
  id: string;
  code: string;
  method: string;
}) => {
  return `${baseUrl}/payments/${method}/${id}/${code}/approve`;
};

export const buildPaymentObj = async (payment: Payment, method: string) => {
  const code = uuid();
  const callback_url = buildCallBackUrl({
    id: payment.id,
    code,
    method,
  });
  const { amount, description } = payment;

  payment.method = method;
  payment.code = code;
  payment.paidAt = new Date();
  switch (payment.method) {
    case "qpay":
      const qpay = await createQpayInvoice({
        amount,
        callback_url,
        description,
      });
      payment.qpay = qpay;
      break;
    default:
      payment.status = "paid";
      delete payment.qpay;
      break;
  }

  return await payment.save();
};
