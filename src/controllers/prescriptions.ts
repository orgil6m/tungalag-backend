// import asyncHandler from "express-async-handler";
// import { PrescriptionModel as Prescription } from "../models/prescription";
// import MyError from "../utils/error";
// import { AuthenticatedRequest } from "../middlewares/auth";

// const publicSelect = { refresh: 0, createdAt: 0, updatedAt: 0 };

// export const getPrescriptionById = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   const prescription = await Prescription.findById(id)
//     .select(publicSelect)
//     .lean();
//   if (!prescription) throw new MyError("Prescription not found");
//   res.status(200).json({ success: true, data: prescription });
// });

// export const getPrescriptions = asyncHandler(async (req, res) => {
//   const prescriptions = await Prescription.find().select(publicSelect);
//   if (!prescriptions || prescriptions.length == 0)
//     throw new MyError("Users not found");
//   res.status(200).json({ success: true, data: prescriptions });
// });

// export const createPrescription = asyncHandler(async (req, res) => {
//   const { body } = req;
//   const prescriptions = await Prescription.create(body);

//   res.status(200).json({ success: true, data: prescriptions });
// });

// export const updatePrescription = asyncHandler(
//   async (req: AuthenticatedRequest, res) => {
//     const { id } = req.params;
//     const { body, userId, userRole } = req;
//     if (id != userId && !userRole?.includes("admin"))
//       throw new MyError("Та зөвхөн өөрийн мэдээллийг засах эрхтэй");

//     const prescription = await Prescription.findByIdAndUpdate(id, body, {
//       new: true,
//     }).select(publicSelect);

//     if (!prescription) throw new MyError("Prescription not found");
//     res.status(200).json({ success: true, data: prescription });
//   }
// );

// export const deletePrescription = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   const prescription = await Prescription.findByIdAndDelete(id);
//   if (!prescription) throw new MyError("Prescription not found");
//   res.status(200).json({ success: true, message: "Successfully deleted" });
// });
