import mongoose, { model, Schema, Types } from "mongoose";
import { CommonDocument, CommonSchema } from "./common";
import { Payment } from "./payments";

export interface Invoice extends CommonDocument {
  amount: number;
  description: string;
  userId: Types.ObjectId;
  code: string;
  paidAt?: Date;
  status?: "pending" | "partial" | "paid";
  payments?: Payment[];
}

const InvoiceSchema = CommonSchema<Invoice>({
  amount: {
    type: Number,
    required: [true, "Нэхэмжлэх дүн дамжуулна уу."],
    min: [100, "Нэхэмжлэх дүн хамгийн багадаа 100 байх боломжтой"],
  },
  description: {
    type: String,
    required: [true, "Нэхэмжлэлийн утга дамжуулна уу."],
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    index: true,
    required: [true, "Хэрэглэгчийн ID дамжуулна уу."],
  },
  paidAt: {
    type: Date,
  },
});

InvoiceSchema.virtual("payments", {
  ref: "Payment",
  localField: "_id",
  foreignField: "invoiceId",
  justOne: false,
});

InvoiceSchema.virtual("status").get(function (
  this: Invoice & { payments?: any[] }
) {
  const payments = this.payments || [];

  if (payments.length === 0) {
    return "pending";
  }

  const paidCount = payments.filter(
    (payment) => payment.status === "paid"
  ).length;

  if (paidCount === payments.length) {
    return "paid";
  }

  if (paidCount > 0) {
    return "partial";
  }

  return "pending";
});

export const InvoiceModel = model<Invoice>("Invoice", InvoiceSchema);
