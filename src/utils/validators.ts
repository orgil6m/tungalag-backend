import { AuthenticatedRequest } from "../middlewares/auth";

export const isValidPhone = (phone: string) => {
  const mongolianPhoneRegex = /^(?:1|6|8|9)\d{7}$/;

  return mongolianPhoneRegex.test(phone);
};

export const isAdmin = (req: AuthenticatedRequest) =>
  req.userRole?.includes("admin");

export const isCreator = (createdBy: any, req: AuthenticatedRequest) =>
  createdBy?.toString() === req.userId?.toString();
