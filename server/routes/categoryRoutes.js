import express from "express";

import {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  getPublicCategories,
} from "../controllers/categoryController.js";

const router = express.Router();

router.post("/", createCategory);
router.get("/public", getPublicCategories);
router.get("/user/:userId", getCategories);
router.get("/:id", getCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;
