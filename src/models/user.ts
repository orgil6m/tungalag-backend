import { Schema, model } from "mongoose";
import { v4 as uuid } from "uuid";
import jwt from "jsonwebtoken";
import { accessTokenExpiresIn, accessTokenSecret } from "../config/env";
import { fromNowInDays } from "../utils/tools";
import { CommonDocument, CommonSchema } from "./common";

export type Address = {
  province?: string;
  district?: string;
  subdistrict?: string;
  street?: string;
  buildingnumber?: string;
  apartmentnumber?: string;
  postalCode?: string;
};

export type User = CommonDocument & {
  firstname: string;
  lastname: string;
  phone: string;
  address?: Address;
  birthdate?: Date;
  gender: "Male" | "Female";
  refresh: { token: string; expireAt: Date };
  role: [string];
  getAccessToken(): { token: string; expireAt: Date };
  getRefreshToken(): Promise<{ token: string; expireAt: Date }>;
};

const AddressSchema = new Schema<Address>(
  {
    province: String,
    district: String,
    subdistrict: String,
    street: String,
    buildingnumber: String,
    apartmentnumber: String,
    postalCode: Number,
  },
  { _id: false }
);

const UserSchema = CommonSchema<User>({
  firstname: String,
  lastname: String,
  phone: {
    type: String,
    required: [true, "Утасны дугаар дамжуулна уу."],
    index: true,
  },
  address: AddressSchema,
  birthdate: Date,
  gender: { type: String, enum: ["Male", "Female"] },
  refresh: { token: String, expireAt: Date },
  role: {
    type: [String],
    enum: ["admin", "employee", "customer"],
    default: ["customer"],
  },
});

UserSchema.virtual("name").get(function () {
  return buildUserName(this);
});

export const buildUserName = (user: User) => {
  const lastname = user.lastname || "";
  const firstname = user.firstname || "";
  const response =
    !lastname || !firstname
      ? "Хэрэглэгч"
      : lastname.slice(0, 1) + "." + firstname;
  return response;
};

UserSchema.methods.getAccessToken = function () {
  const token = jwt.sign(
    { id: this._id.toString(), role: this.role },
    accessTokenSecret,
    {
      expiresIn: accessTokenExpiresIn,
    }
  );
  const expirationTimeInMinutes = parseInt(accessTokenExpiresIn, 10);
  const tokenExpTime = new Date();
  tokenExpTime.setMinutes(tokenExpTime.getMinutes() + expirationTimeInMinutes);
  return { token: token, expireAt: tokenExpTime };
};

UserSchema.methods.getRefreshToken = async function () {
  const token = uuid();
  const tokenExpTime = fromNowInDays(7);
  this.refresh = { token, expireAt: tokenExpTime };
  await this.save();
  return { token: token, expireAt: tokenExpTime };
};

UserSchema.virtual("prescriptions", {
  ref: "Prescription",
  localField: "_id",
  foreignField: "userId",
  justOne: false,
  match: { isActive: true },
});

export const UserModel = model<User>("User", UserSchema);
