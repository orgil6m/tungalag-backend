import { model } from "mongoose";
import { CommonDocument, CommonSchema } from "./common";

export type Branch = CommonDocument & {
  name: string;
  address: string;
  url?: string;
  contact?: string;
  isActive: boolean;
};

const BranchSchema = CommonSchema<Branch>({
  name: {
    type: String,
    required: [true, "Салбарын нэр дамжуулна уу."],
    index: true,
  },
  address: { type: String, required: [true, "Салбарын хаяг дамжуулна уу."] },
  contact: { type: String },
  url: { type: String, required: false },
  isActive: { type: Boolean, default: true },
});

export const BranchModel = model<Branch>("Branch", BranchSchema);
