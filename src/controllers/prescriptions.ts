import { PrescriptionModel } from "../models/prescription";
import { publicSelect } from "../utils/tools";
import { CommonController } from "./common";
import { asyncHandler, myAsyncHandler } from "../utils/asyncHandler";
import { AuthenticatedRequest } from "../middlewares/auth";

const { createdBy, ...defaultSelect } = publicSelect;

const controller = new CommonController(PrescriptionModel, {
  defaultSelect,
});

export const getPrescriptionById = myAsyncHandler(controller.getOneById, {
  populate: [{ path: "createdBy", select: "firstname lastname name" }],
});

export const getPrescriptions = myAsyncHandler(controller.getMany);

export const createPrescription = myAsyncHandler(controller.create);
export const updatePrescription = myAsyncHandler(controller.update);
export const deletePrescription = myAsyncHandler(controller.delete);

export const getPrescriptionsHistory = asyncHandler(
  async (req: AuthenticatedRequest, res) => {
    const { userId } = req.params;
    const data = await PrescriptionModel.find({ userId, isActive: 1 })
      .populate("createdBy", "firstname lastname")
      .populate("branchId", "name address url")
      .sort({ createdAt: -1 });
    res.json({ status: "success", data });
  }
);

export const getLatestPrescription = asyncHandler(
  async (req: AuthenticatedRequest, res) => {
    const { userId } = req.params;
    const data = await PrescriptionModel.findOne(
      { userId, isActive: 1 },
      {},
      { sort: { createdAt: -1 } }
    )
      .populate("createdBy", "firstname lastname")
      .populate("branchId", "name address url");
    res.json({ status: "success", data });
  }
);
