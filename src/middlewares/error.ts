import { NextFunction, Request, Response } from "express";
import MyError from "../utils/error";

const errorHandler = (
  err: MyError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error: MyError = { ...err } as MyError;
  error.message = err.message;

  if (error.message === "jwt malformed") {
    error.message = "Та логин хийж байж энэ үйлдлийг хийх боломжтой...";
    error.statusCode = 401;
  }

  res.status(err.statusCode || 500).json({
    success: false,
    error: error,
  });
};

export default errorHandler;
