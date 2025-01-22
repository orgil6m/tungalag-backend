import { Request, Response } from "express";
import MyError from "../utils/error";
import asyncHandler from "express-async-handler";

export const errorPage = asyncHandler(async (req: Request, res: Response) => {
  throw new MyError(
    `The requested endpoint ${req.originalUrl} is not available.`,
    404
  );
});
