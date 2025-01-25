import { QueryProps } from "../controllers/common";
import expressAsyncHandler from "express-async-handler";

export const myAsyncHandler = <T>(func: Function, props?: QueryProps<T>) =>
  expressAsyncHandler(async (req, res) => await func({ req, res, ...props }));

export const asyncHandler = expressAsyncHandler;
