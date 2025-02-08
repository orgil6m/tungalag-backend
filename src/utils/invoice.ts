import { baseUrl } from "../config/env";
import { Invoice } from "../models/invoice";
import { createQpayInvoice } from "./qpay";

export const buildCallBackUrl = (invoice: Invoice) => {
  const { _id, code, method } = invoice;
  return `${baseUrl}/invoice/${method}${_id}/${code}/approve`;
};

export const buildInvoiceObj = async (invoice: Invoice, method: string) => {
  const callback_url = buildCallBackUrl(invoice);
  const { amount, description } = invoice;

  switch (method) {
    case "qpay":
      return await createQpayInvoice({
        amount,
        callback_url,
        description,
      });

    case "storepay":
      return {};

    case "pocket":
      return {};
    default:
      return {};
  }
};
