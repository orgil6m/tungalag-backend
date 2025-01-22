import asyncHandler from "express-async-handler";
import { UserModel } from "../models/user";
import { publicSelect } from "../utils/tools";
import { CommonController } from "./common";
import { PrescriptionModel } from "../models/prescription";

const select = { ...publicSelect, refresh: 0 };

const userController = new CommonController(UserModel, { select });

export const getUserById = userController.getById;
export const getUsers = userController.getAll;
export const createUser = userController.create;
export const updateUser = userController.updateById;
export const deleteUser = userController.deleteById;

export const getPrescriptionHistory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const history = await PrescriptionModel.find({ userId: id })
    .select({
      createdAt: 0,
      updatedAt: 0,
    })
    .populate({ path: "createdBy", select: "firstname lastname name" });
  res.status(200).json({ success: true, data: history });
});
