// routes/uploadRoute.js
import express from "express";
import { upload, uploadImage } from "../controllers/uploadController.js";

const router = express.Router();

router.post("/image", upload, uploadImage);

export default router;
