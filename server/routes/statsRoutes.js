import express from "express";
import {
  getNoteStats,
  getBatchNoteStats,
} from "../controllers/statsController.js";

const router = express.Router();

// 获取单个笔记的统计信息
router.get("/notes/:noteId", getNoteStats);

// 批量获取多个笔记的统计信息
router.post("/notes/batch", getBatchNoteStats);

export default router;
