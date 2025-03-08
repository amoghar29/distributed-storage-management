import express from "express";
import { fileUploadController,fileUploadCompleteController } from "../controllers/fileController/upload";
const router = express.Router();

router.get("/get-presignedurl", fileUploadController);
router.post("/save",fileUploadCompleteController );

export default router;
