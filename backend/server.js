import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chatRoutes from "./routes/chatRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import { errorHandler } from "./utils/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import connectDB from "./config/mongoDB.js";

dotenv.config();
connectDB();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", chatRoutes);
app.use("/api/session", sessionRoutes);
app.use("/api/auth", authRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

