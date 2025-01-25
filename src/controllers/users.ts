import { UserModel } from "../models/user";
import { publicSelect } from "../utils/tools";
import { CommonController } from "./common";
import { myAsyncHandler } from "../utils/asyncHandler";

const controller = new CommonController(UserModel, {
  defaultSelect: { ...publicSelect, refresh: 0 },
});

export const getUserById = myAsyncHandler(controller.getOneById);
export const getUsers = myAsyncHandler(controller.getMany);
export const createUser = myAsyncHandler(controller.create);
export const updateUser = myAsyncHandler(controller.update);
export const deleteUser = myAsyncHandler(controller.delete);

export const getEmployees = myAsyncHandler(controller.getMany, {
  find: { role: "employee" },
});

export const getCustomers = myAsyncHandler(controller.getMany, {
  find: { role: "customer" },
});
