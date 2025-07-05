// import { addlecturer } from "../controllers/lecturerController";
import { Router } from "express";
import { authoriseLecturer } from "../middleware/authorise";
import {
	handleSingleFile,
	handleMany,
} from "../controllers/lecturerController";

const router = Router();

//router.post("/add", authoriseLecturer(["LECTURER"]), addlecturer);
router.post("/uploads", handleSingleFile);

router.post("/multiple", handleMany);

export default router;
