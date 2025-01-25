import { model, Schema, Document } from "mongoose";

type Vision = {
  sphere?: number;
  cylinder?: number;
  axis?: number;
  vsc?: number;
  vcc?: number;
};

export interface Prescription extends Document {
  userId: Schema.Types.ObjectId;
  date: Date;
  pd?: number;
  near: { rightEye: Vision; leftEye: Vision };
  far: { rightEye: Vision; leftEye: Vision };
  notes?: String;
  branchId: Schema.Types.ObjectId;
  createdBy: Schema.Types.ObjectId;
  createdAt: Date;
  updatedBy?: Schema.Types.ObjectId;
  updatedAt?: Date;
}

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

const PrescriptionSchema = new Schema<Prescription>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true, default: Date.now() },
    pd: Number,
    near: { rightEye: VisionSchema, leftEye: VisionSchema },
    far: { rightEye: VisionSchema, leftEye: VisionSchema },
    branchId: { type: Schema.Types.ObjectId, ref: "Branch", required: true },
    notes: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const PrescriptionModel = model<Prescription>(
  "Prescription",
  PrescriptionSchema
);
