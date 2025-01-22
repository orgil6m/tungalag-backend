import { PrescriptionModel } from "../models/prescription";
import { publicSelect } from "../utils/tools";
import { CommonController } from "./common";

const { createdBy, ...otherPublicSelect } = publicSelect;
const select = { ...otherPublicSelect };
const populate = [{ path: "createdBy", select: "firstname lastname name" }];
const prescriptionController = new CommonController(PrescriptionModel, {
  select,
  populate,
});

export const getPrescriptionById = prescriptionController.getById;
export const getPrescriptions = prescriptionController.getAll;
export const createPrescription = prescriptionController.create;
export const updatePrescription = prescriptionController.updateById;
export const deletePrescription = prescriptionController.deleteById;
