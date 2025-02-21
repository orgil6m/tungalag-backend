import { BranchModel } from "../models/branch";
import { publicSelect } from "../utils/tools";
import { CommonController } from "./common";
import { myAsyncHandler } from "../utils/asyncHandler";

const controller = new CommonController(BranchModel, {
  defaultSelect: { ...publicSelect },
});

export const getBranchById = myAsyncHandler(controller.getOneById);
export const getBranches = myAsyncHandler(controller.getMany, {
  // find: { isActive: true },
});
export const createBranch = myAsyncHandler(controller.create);
export const updateBranch = myAsyncHandler(controller.update);
export const deleteBranch = myAsyncHandler(controller.delete);
