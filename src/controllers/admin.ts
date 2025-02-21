import moment from "moment";
import { PaymentModel } from "../models/payments";
import { PrescriptionModel } from "../models/prescription";
import { UserModel } from "../models/user";
import { asyncHandler } from "../utils/asyncHandler";

export const getAdminAnalytics = asyncHandler(async (req, res) => {
  let { startDate, endDate } = req.query;

  if (!startDate)
    startDate = moment.utc().startOf("month").toDate().toISOString();
  if (!endDate) endDate = moment.utc().endOf("month").toDate().toISOString();

  const [payments, prescriptions, users] = await Promise.all([
    PaymentModel.find(
      {
        status: "paid",
        createdAt: { $gte: startDate, $lte: endDate },
      },
      { amount: 1 }
    ).lean(),
    PrescriptionModel.countDocuments({
      isActive: 1,
      createdAt: { $gte: startDate, $lte: endDate },
    }),
    UserModel.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate },
    }),
  ]);
  const totalSales = payments.reduce((acc, curr) => acc + curr.amount, 0);
  const data = { totalSales, prescriptions, totalUsers: users };
  res.json({ status: "success", data });
});
