import cors from "cors";

const allowedOrigins = ["http://localhost:3000"];

const corsOptions = cors({
  origin: allowedOrigins,
  allowedHeaders: ["Authorization", "Content-Type", "Accept-Ranges", "Device"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
});

export default corsOptions;
