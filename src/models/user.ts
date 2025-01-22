import { Schema, model, Document } from "mongoose";
import { v4 as uuid } from "uuid";

import jwt from "jsonwebtoken";
import { accessTokenExpiresIn, accessTokenSecret } from "../config/env";
import { fromNowInDays } from "../utils/tools";

export type Address = {
  province?: string;
  district?: string;
  subdistrict?: string;
  street?: string;
  buildingnumber?: string;
  apartmentnumber?: string;
  postalCode?: string;
};

export interface User extends Document {
  firstname: string;
  lastname: string;
  phone: string;
  address?: Address;
  birthdate?: Date;
  gender: "Male" | "Female";
  createdAt: Date;
  updatedAt: Date;
  refresh: { token: string; expireAt: Date };
  role: [string];
  getAccessToken(): { accessToken: string; accessExpTime: Date };
  getRefreshToken(): Promise<{ refreshToken: string; refreshExpTime: Date }>;
}

const UserSchema = new Schema<User>(
  {
    firstname: String,
    lastname: String,
    phone: { type: String, required: true, index: true },
    birthdate: Date,
    gender: { type: String, enum: ["Male", "Female"] },
    refresh: { token: String, expireAt: Date },
    role: {
      type: [String],
      required: true,
      enum: ["admin", "employee", "customer"],
      default: ["customer"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

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
  return { accessToken: token, accessExpTime: tokenExpTime };
};

UserSchema.methods.getRefreshToken = async function () {
  const token = uuid();
  const tokenExpTime = fromNowInDays(7);
  this.refresh = { token, expireAt: tokenExpTime };
  await this.save();
  return { refreshToken: token, refreshExpTime: tokenExpTime };
};

export const UserModel = model<User>("User", UserSchema);
