import dotenv from "dotenv";
dotenv.config({ path: ".env" });

export const host = process.env.HOST || "http://localhost";
export const port = process.env.PORT || "8000";
export const dbConnectionUrl = process.env.DB_CONNECTION_URL || "";
export const dbName = process.env.DB_NAME;
export const smsToken = process.env.MESSAGE_TOKEN;

export const accessTokenSecret =
  process.env.ACCESS_TOKEN_SECRET ?? "tungalag_access_secret";
export const accessTokenExpiresIn =
  process.env.ACCESS_TOKEN_EXPIRES_IN ?? "180m";
