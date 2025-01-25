import { Document, Schema, model } from "mongoose";

export interface Branch extends Document {
  name: string;
  address: string;
  url?: string;
  location?: {
    lat: number;
    lng: number;
  };
  createdBy: Schema.Types.ObjectId;
  createdAt: Date;
  updatedBy?: Schema.Types.ObjectId;
  updatedAt?: Date;
}

const BranchSchema = new Schema<Branch>(
  {
    name: { type: String, required: [true, "Branch name is required"] },
    address: { type: String, required: [true, "Branch address is required"] },
    url: { type: String, required: false },
    location: {
      lat: { type: Number, required: false },
      lng: { type: Number, required: false },
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: false },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const BranchModel = model<Branch>("Branch", BranchSchema);
