import asyncHandler from "express-async-handler";

export const sampleGet = asyncHandler(async (req, res) => {
  const data = [{}];
  if (!data) {
    throw new Error("Data not found");
  }
  res.status(200).json(data);
});
