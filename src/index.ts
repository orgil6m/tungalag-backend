import "colors";
import express, { Application } from "express";
import routes from "./routes";
import middlewares from "./middlewares";
import errorHandler from "./middlewares/error";
import env from "./config/env";

const { host, port } = env;
const URL = `${host}:${port}`;
const app: Application = express();

app.use(middlewares);
app.use(routes);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`[App running] : ${URL}`.blue);
});
