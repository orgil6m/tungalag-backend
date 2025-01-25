import MyError from "../utils/error";
import asyncHandler from "express-async-handler";

export const errorPage = asyncHandler(async (req, res) => {
  throw new MyError(
    `The requested endpoint ${req.originalUrl} is not available.`,
    404
  );
});
