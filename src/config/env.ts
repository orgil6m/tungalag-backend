const dotenv = require("dotenv");
dotenv.config({ path: ".env" });

const config = {
  host: process.env.HOST || "http://localhost",
  port: process.env.PORT || "8080",
  dbConnectionUrl: process.env.DB_CONNECTION_URL,
  dbName: process.env.DB_NAME,
};

export default config;
