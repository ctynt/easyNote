import express from "express";
import { chatWithAI } from "../controllers/aiController.js";

const router = express.Router();

router.get("/chat", chatWithAI);

export default router;
