import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import MyError from "../utils/error";
import { accessTokenExpiresIn, accessTokenSecret } from "../config/env";

interface TokenPayload extends JwtPayload {
  id: string;
  role: string[];
}

interface AuthenticatedRequest extends Request {
  userId?: string;
  userRole?: string[];
}

export const isAuth = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new MyError("Токен байхгүй байна!", 401);
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new MyError("Токен байхгүй байна!", 401);
    }

    try {
      const decoded = jwt.verify(token, accessTokenSecret) as TokenPayload;

      req.userId = decoded.id;
      req.userRole = decoded.role;

      next();
    } catch (error) {
      throw new MyError("Токен буруу эсвэл хугацаа дууссан!", 401);
    }
  }
);

export const authorize = (...allowedRoles: string[]) => {
  return asyncHandler(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      if (!req.userRole) {
        throw new MyError("Таны эрх хүрэхгүй байна!", 403);
      }
      const hasAccess = allowedRoles.some((role) =>
        req.userRole?.includes(role)
      );

      if (!hasAccess) {
        throw new MyError("Таны эрх хүрэхгүй байна!", 403);
      }
      next();
    }
  );
};
