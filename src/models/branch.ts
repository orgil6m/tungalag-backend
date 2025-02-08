import { model } from "mongoose";
import { CommonDocument, CommonSchema } from "./common";

export type Branch = CommonDocument & {
  name: string;
  address: string;
  url?: string;
  location?: {
    lat: number;
    lng: number;
  };
};

const BranchSchema = CommonSchema<Branch>({
  name: {
    type: String,
    required: [true, "Салбарын нэр дамжуулна уу."],
    index: true,
  },
  address: { type: String, required: [true, "Салбарын хаяг дамжуулна уу."] },
  url: { type: String, required: false },
  location: {
    lat: { type: Number, required: false },
    lng: { type: Number, required: false },
  },
});

export const BranchModel = model<Branch>("Branch", BranchSchema);
