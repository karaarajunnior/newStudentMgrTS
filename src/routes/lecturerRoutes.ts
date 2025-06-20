import { addlecturer } from "../controllers/lecturerController";
import { Router } from "express";
import { authoriseLecturer } from "../middleware/authorise";

const router = Router();

//router.post("/add", authoriseLecturer(["LECTURER"]), addlecturer);

export default router;
