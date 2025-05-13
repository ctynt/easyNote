import express from "express";
import {
  getRecentItems,
  searchItems,
} from "../controllers/searchController.js";

const router = express.Router();

// 获取最近的笔记和知识库
router.get("/recent/:userId", getRecentItems);

// 搜索笔记和知识库
router.get("/search/:userId", searchItems);

export default router;
