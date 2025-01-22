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
  createdBy: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const VisionSchema = new Schema<Vision>(
  {
    sphere: { type: Number },
    cylinder: { type: Number },
    axis: { type: Number },
    vsc: { type: String },
    vcc: { type: String },
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
    notes: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
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
