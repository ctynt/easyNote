import express from "express";
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  getNote,
  getNotesByCategory,
  getNotesList,
} from "../controllers/noteController.js";

const router = express.Router();
router.post("/", createNote);
router.get("/notesList", getNotesList);
router.get("/user/:userId", getNotes);
router.get("/:id", getNote);
router.get("/categories/:userId/:categoryId", getNotesByCategory);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router;
