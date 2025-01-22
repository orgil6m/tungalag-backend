import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import loggerMiddleware from "./logger";
import cors from "./cors";

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });

const securityMiddlewares = [helmet(), hpp()];
const utilMiddlewares = [
  cookieParser(),
  express.json(),
  limiter,
  cors,
  loggerMiddleware,
];
const middlewares = [...securityMiddlewares, ...utilMiddlewares];

export default middlewares;
