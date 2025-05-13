import express from "express";
import {
  createStar,
  getStars,
  getStarById,
  updateStar,
  deleteStar,
  addStarContent,
  removeStarContent,
  getStarContent,
  getAllStarContent,
  getStarsByNoteId,
} from "../controllers/starController.js";

const router = express.Router();

router.post("/add/:id", addStarContent);

router.post("/list", getStars);

router.get("/content/all/:userId", getAllStarContent);

router.get("/content/:userId/:id", getStarContent);

router.get("/note/:noteId/:userId", getStarsByNoteId);

router.delete("/content/:id", removeStarContent);

router.delete("/delete/:userId/:id", deleteStar);

router.get("/:id", getStarById);

router.put("/:id", updateStar);

router.post("/", createStar);

export default router;
