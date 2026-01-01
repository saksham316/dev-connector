import express from "express";
import "./config/dotEnv.config.js";
import { connectDB } from "./config/database.config.js";
import cookieParser from "cookie-parser";
import { authRouter } from "./routes/auth.router.js";
import { requestRouter } from "./routes/request.router.js";
import { profileRouter } from "./routes/profile.router.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "*",
  })
);

// Routers -----
app.use("/api", authRouter);
app.use("/api", profileRouter);
app.use("/api", requestRouter);
// -------------

// connectDB - database connection
connectDB()
  .then(() => {
    console.log("DB connected successfully");
    app.listen(4009, () => {
      console.log("App running on port 4009");
    });
  })
  .catch((err) => console.error("DB failed to connect", err));
