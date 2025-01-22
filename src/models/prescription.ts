import { model, Schema } from "mongoose";

type Vision = {
  sphere?: number;
  cylinder?: number;
  axis?: number;
  vsc?: number;
  vcc?: number;
};

type Prescription = {
  userId: Schema.Types.ObjectId;
  date: Date;
  pd?: number;
  rightEye: {
    near: Vision;
    far: Vision;
  };
  leftEye: {
    near: Vision;
    far: Vision;
  };
  notes?: String;
  createdBy: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

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
    date: { type: Date, required: true },
    rightEye: {
      near: VisionSchema,
      far: VisionSchema,
    },
    leftEye: {
      near: VisionSchema,
      far: VisionSchema,
    },
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
