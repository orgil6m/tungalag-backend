import { Schema, model } from "mongoose";
import { CommonDocument, CommonSchema } from "./common";

const allowedPaymentMethods = [
  "qpay",
  "cash",
  "card",
  "storepay",
  "pocket",
  "account",
];

export interface QpayBankUrl {
  name: string;
  link: string;
  description: string;
  logo: string;
}

export interface Qpay {
  invoice_id: string;
  qr_text: string;
  urls: QpayBankUrl[];
}

export interface Payment extends CommonDocument {
  amount: number;
  method: string;
  description: string;
  refId: Schema.Types.ObjectId;
  status: "pending" | "paid";
  code: string;
  qpay?: Qpay;
  paidAt?: Date;
}

const QpaySchema = new Schema<Qpay>(
  {
    invoice_id: {
      type: String,
      required: [true, "QPay invoice_id дамжуулна уу."],
    },
    qr_text: {
      type: String,
      required: [true, "QPay qr_text дамжуулна уу."],
    },
    urls: [
      {
        name: {
          type: String,
          required: [true, "QPay bank name дамжуулна уу."],
        },
        link: {
          type: String,
          required: [true, "QPay bank link дамжуулна уу."],
        },
        description: {
          type: String,
          required: [true, "QPay bank description дамжуулна уу."],
        },
        logo: {
          type: String,
          required: [true, "QPay bank logo дамжуулна уу."],
        },
      },
    ],
  },
  { _id: false }
);

const PaymentSchema = CommonSchema<Payment>({
  amount: {
    type: Number,
    required: [true, "Төлөлт хийх дүн дамжуулна уу."],
    min: [100, "Төлөлт хийх дүн хамгийн багадаа 100 байх боломжтой"],
  },
  method: {
    type: String,
    enum: allowedPaymentMethods,
  },
  description: {
    type: String,
    required: [true, "Төлөлтийн тайлбар дамжуулна уу."],
  },
  invoiceId: {
    type: Schema.Types.ObjectId,
    ref: "Invoice",
    index: true,
    required: [true, "Invoice ID дамжуулна уу."],
  },
  status: {
    type: String,
    enum: ["pending", "paid"],
    default: "pending",
  },
  code: {
    type: String,
    index: true,
  },
  paidAt: {
    type: Date,
  },
  qpay: {
    type: QpaySchema,
  },
});

export const PaymentModel = model<Payment>("Payment", PaymentSchema);
