import mongoose from "mongoose";
import { dbConnectionUrl, dbName } from "./env";

export const connectDB = async () => {
  await mongoose.connect(dbConnectionUrl, { dbName });
  console.log(`[MongoDB connected] : ${dbName}`.blue);
};
