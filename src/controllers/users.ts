import asyncHandler from "express-async-handler";
import { User, UserModel } from "../models/user";
import MyError from "../utils/error";

const publicSelect = { refresh: 0, createdAt: 0, updatedAt: 0 };

export const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await UserModel.findById(id).select(publicSelect).lean();
  if (!user) throw new MyError("User not found");
  res.status(200).json({ success: true, data: user });
});

export const getUsers = asyncHandler(async (req, res) => {
  const users = await UserModel.find().select(publicSelect);
  if (!users || users.length == 0) throw new MyError("Users not found");
  res.status(200).json({ success: true, data: users });
});

export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { body } = req;
  const user = await UserModel.findByIdAndUpdate(id, body, {
    new: true,
  }).select(publicSelect);

  if (!user) throw new MyError("User not found");
  res.status(200).json({ success: true, data: user });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await UserModel.findByIdAndDelete(id);
  if (!user) throw new MyError("User not found");
  res.status(200).json({ success: true, message: "Successfully deleted" });
});
