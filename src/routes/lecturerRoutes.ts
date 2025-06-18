import { addlecturer } from "../controllers/lecturerController";
import { Router } from "express";

const router = Router();

router.post("/add", addlecturer);

export default router;
