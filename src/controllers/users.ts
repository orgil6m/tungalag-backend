import { UserModel } from "../models/user";
import { publicSelect } from "../utils/tools";
import { CommonController } from "./common";
import { asyncHandler, myAsyncHandler } from "../utils/asyncHandler";
import { AuthenticatedRequest } from "../middlewares/auth";
import MyError from "../utils/error";
import { isAdmin, isOnlyCustomer } from "../utils/validators";

const controller = new CommonController(
  UserModel,
  {
    defaultSelect: { ...publicSelect, refresh: 0 },
  },
  "Хэрэглэгч"
);

export const getUserById = myAsyncHandler(controller.getOneById);
export const getUsers = myAsyncHandler(controller.getMany);

export const createUser = asyncHandler(
  async (req: AuthenticatedRequest, res) => {
    req.body.createdBy = req.userId;
    const { phone } = req.body;
    const isExist = await UserModel.exists({ phone });
    if (isExist) throw new MyError("Бүртгэлтэй утасны дугаар байна", 400);
    const newData = new UserModel(req.body);
    const savedData = await newData.save();
    res.status(200).json({
      status: "success",
      message: `Шинэ хэрэглэгч амжилттай үүсгэлээ.`,
      data: savedData,
    });
  }
);

export const deleteUser = myAsyncHandler(controller.delete);

export const updateUser = asyncHandler(
  async (req: AuthenticatedRequest, res) => {
    const { body } = req;
    const { id } = req.params;
    const data = await UserModel.findById(id);

    if (!data) throw new MyError("Хэрэглэгч олдсонгүй", 404);

    if (id != req.userId && isOnlyCustomer(req))
      throw new MyError("Та зөвхөн өөрийн мэдээллийг засах эрхтэй", 403);

    if (body.phone) {
      const isExist = await UserModel.exists({ phone: body.phone });
      if (isExist) throw new MyError("Бүртгэлтэй утасны дугаар байна", 400);
    }

    const savedData = await UserModel.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      message: `Хэрэглэгчийн мэдээлэл амжилттай засагдлаа.`,
      data: savedData,
    });
  }
);

export const getUsersBySearch = asyncHandler(
  async (req: AuthenticatedRequest, res) => {
    const query: any = { ...req.query };

    if (query.phone) {
      query.phone = { $regex: query.phone, $options: "i" };
    }

    const data = await UserModel.find(query).sort({ createdAt: -1 });

    res.json({ status: "success", data });
  }
);

export const getEmployees = myAsyncHandler(controller.getMany, {
  find: { role: "employee" },
});

export const getCustomers = myAsyncHandler(controller.getMany, {
  find: { role: "customer" },
});
