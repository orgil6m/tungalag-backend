import asyncHandler from "express-async-handler";
import MyError from "../utils/error";
import { isValidPhone } from "../utils/validators";
import { sendMessage } from "../utils/sms";
import { OtpModel as Otp } from "../models/otp";
import { buildUserName, User, UserModel } from "../models/user";
import { createOtp, handleOtpError, verifyOtp } from "../utils/otp";
import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth";
import { PrescriptionModel } from "../models/prescription";

const MESSAGES = {
  PHONE_REQUIRED: "Phone is required!",
  INVALID_PHONE: "Please provide a valid phone number.",
  OTP_NOT_FOUND: "OTP not found.",
  INVALID_OTP: "Invalid OTP code.",
  OTP_USED: "OTP has already been used.",
  OTP_SENT: "OTP sent successfully.",
  OTP_VERIFIED: "OTP verified successfully.",
  OTP_EXPIRED: "OTP has expired.",
};

export const buildUserInstance = async (
  user: User,
  res: Response,
  isRefresh = true
) => {
  const access = user.getAccessToken();
  let refresh = {
    token: user.refresh.token,
    expireAt: user.refresh.expireAt,
  };

  if (isRefresh) refresh = await user.getRefreshToken();

  const latestPrescription = await PrescriptionModel.findOne(
    {
      userId: user._id,
    },
    {},
    { sort: { createdAt: -1 } }
  )
    .populate("createdBy", "firstname lastname")
    .populate("branchId", "name address url");

  return {
    access,
    refresh,
    user: {
      id: user._id,
      phone: user.phone,
      firstname: user.firstname,
      lastname: user.lastname,
      name: buildUserName(user),
      role: user.role,
      gender: user.gender,
      birthdate: user.birthdate,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      latestPrescription,
    },
  };
};

export const reqOtp = asyncHandler(async (req, res) => {
  const { phone } = req.body;

  if (!phone) throw new MyError(MESSAGES.PHONE_REQUIRED, 400);
  if (!isValidPhone(phone)) throw new MyError(MESSAGES.INVALID_PHONE, 400);

  const code = await createOtp(phone);
  const message = `Tungalag Talst | Batalgaajuulad code: ${code}`;

  await sendMessage(phone, message);

  res.status(200).json({ success: true, code, message: MESSAGES.OTP_SENT });
});

export const checkOtp = asyncHandler(async (req, res) => {
  const { phone, code } = req.body;

  if (!phone || !code) throw new MyError(MESSAGES.PHONE_REQUIRED, 400);

  const otp = await Otp.findOne({ phone }).sort({ createdAt: -1 });
  if (!otp) throw new MyError(MESSAGES.OTP_NOT_FOUND, 400);
  handleOtpError(otp, code);

  let user = await UserModel.findOne({ phone });
  if (!user) user = await UserModel.create({ phone });

  verifyOtp(otp);
  await otp.save();

  res.status(200).json({
    success: true,
    data: await buildUserInstance(user, res),
    message: MESSAGES.OTP_VERIFIED,
  });
});

export const refreshAccessToken = asyncHandler(
  async (req: AuthenticatedRequest, res) => {
    const token = req.body.refreshToken;
    const userId = req.userId;
    if (!token) throw new MyError("Refresh token is required", 401);

    const user = await UserModel.findOne({
      "refresh.token": token,
      "refresh.expireAt": { $gt: new Date() },
      _id: userId,
    });

    if (!user) throw new MyError("Invalid refresh token", 403);
    const data = await buildUserInstance(user, res, false);
    res.status(200).json({ success: true, data: data });
  }
);
