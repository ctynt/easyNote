import express from "express";
const router = express.Router();
import {
  getComments,
  addComment,
  deleteComment,
} from "../controllers/commentController.js";

// 获取文章评论列表
router.get("/notes/:note_id/comments", getComments);

// 添加评论
router.post("/comments", addComment);

// 删除评论
router.delete("/comments/:id", deleteComment);

export default router;
