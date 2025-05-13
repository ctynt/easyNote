import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import translateRoutes from "./routes/translateRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import actionRoutes from "./routes/actionRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import starRoutes from "./routes/starRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
dotenv.config();
const app = express();
const allowedOrigins = ["http://localhost:5173"];
// const allowedOrigins = ['http://43.142.252.113:8080'];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "这个网站的跨域资源共享（CORS）策略不允许从指定的来源进行访问。";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true, // 允许发送 Cookies
  })
);

app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/translate", translateRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/actions", actionRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/stars", starRoutes);
app.use("/api/ai", aiRoutes);
export default app;
