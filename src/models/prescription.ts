import { model, Schema } from "mongoose";
import { CommonDocument, CommonSchema } from "./common";

type Vision = {
  sphere?: number;
  cylinder?: number;
  axis?: number;
  vsc?: number;
  vcc?: number;
};

export type Prescription = CommonDocument & {
  userId: Schema.Types.ObjectId;
  date: Date;
  pd?: Number;
  near: { rightEye: Vision; leftEye: Vision };
  far: { rightEye: Vision; leftEye: Vision };
  notes?: string;
  isActive: boolean;
  branchId: Schema.Types.ObjectId;
};

const VisionSchema = new Schema<Vision>(
  {
    sphere: { type: Number },
    cylinder: { type: Number },
    axis: { type: Number },
    vsc: { type: Number },
    vcc: { type: Number },
  },
  { _id: false }
);

const PrescriptionSchema = CommonSchema<Prescription>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Хэрэглэгчийн ID дамжуулна уу."],
  },
  date: { type: Date, required: true, default: Date.now() },
  pd: { type: Number },
  near: { rightEye: VisionSchema, leftEye: VisionSchema },
  far: { rightEye: VisionSchema, leftEye: VisionSchema },
  branchId: {
    type: Schema.Types.ObjectId,
    ref: "Branch",
    required: [true, "Салбарын ID дамжуулна уу."],
  },
  isActive: { type: Boolean, default: true },
  notes: { type: String },
});

export const PrescriptionModel = model<Prescription>(
  "Prescription",
  PrescriptionSchema
);
