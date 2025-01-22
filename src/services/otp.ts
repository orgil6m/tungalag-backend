import { Otp, OtpModel } from "../models/otp";
import MyError from "../utils/error";
import { getRandomCode } from "../utils/tools";

const MESSAGES = {
  INVALID_OTP: "Invalid OTP code.",
  OTP_USED: "OTP has already been used.",
  OTP_EXPIRED: "OTP has expired.",
};

export const createOtp = async (phone: number) => {
  const code = getRandomCode(4);
  const expireAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
  await OtpModel.create({ phone, code, expireAt });
  return code;
};

export const verifyOtp = (otp: Otp) => {
  otp.isVerified = true;
  otp.verifiedAt = new Date();
};

export const handleOtpError = (otp: Otp, code: String) => {
  if (otp.code !== code.toString())
    throw new MyError(MESSAGES.INVALID_OTP, 400);
  if (otp.isVerified) throw new MyError(MESSAGES.OTP_USED, 400);
  if (otp.expireAt && otp.expireAt < new Date()) {
    throw new MyError(MESSAGES.OTP_EXPIRED, 400);
  }
};
