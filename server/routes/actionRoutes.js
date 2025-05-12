import express from "express";
const router = express.Router();
import {
  createAction,
  getActionStatus,
} from "../controllers/actionController.js";

// 创建/取消点赞或收藏
router.post("/", createAction);

// 获取笔记的点赞和收藏状态
router.get("/:userId/:noteId", getActionStatus);
export default router;
