import mongoose from "mongoose";
const { Schema } = mongoose;

export type Otp = {
  phone: String;
  code: String;
  createdAt: Date;
  expireAt: Date;
  isVerified: boolean;
  verifiedAt?: Date;
};

const OtpSchema = new Schema<Otp>(
  {
    phone: {
      type: String,
      required: [true, "Phone дамжуулна уу"],
      index: true,
    },
    code: {
      type: String,
      index: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    expireAt: {
      type: Date,
      required: true,
      default: function () {
        return new Date(Date.now() + 5 * 60 * 1000);
      },
      index: { expires: 0 },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifiedAt: { type: Date },
  },
  {
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
    minimize: false,
  }
);

export const OtpModel = mongoose.model("Otp", OtpSchema);
