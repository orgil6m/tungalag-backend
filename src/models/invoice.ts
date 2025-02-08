import { Schema, model } from "mongoose";
import { CommonDocument, CommonSchema } from "./common";

const allowedInvoiceMethods = ["qpay", "cash", "card", "storepay", "pocket"];
const allowedRefTypes = ["prescription"];

export interface Invoice extends CommonDocument {
  amount: number;
  method: string;
  description: string;
  refId: Schema.Types.ObjectId;
  status: "pending" | "success";
  code: number;
}

const InvoiceSchema = CommonSchema<Invoice>({
  amount: {
    type: Number,
    required: [true, "Нэхэмжлэх дүн дамжуулна уу."],
    min: [100, "Нэхэмжлэх дүн хамгийн багадаа 100 байх боломжтой"],
  },
  method: {
    type: String,
    enum: allowedInvoiceMethods,
    required: [true, "Төлбөрийн хэрэгсэл дамжуулна уу."],
  },
  description: {
    type: String,
    required: [true, "Нэхэмжлэлийн утга дамжуулна уу."],
  },
  refType: {
    type: String,
    required: [true, "Ref Type дамжуулна уу."],
    enum: allowedRefTypes,
  },
  refId: {
    type: Schema.Types.ObjectId,
    required: [true, "Ref ID дамжуулна уу."],
  },
  status: {
    type: String,
    enum: ["pending", "success"],
    default: "pending",
  },
  code: {
    type: String,
    required: [true, "Гүйлгээ баталгаажуулах код дамжуулна уу."],
    index: true,
  },
});

export const InvoiceModel = model<Invoice>("Invoice", InvoiceSchema);
