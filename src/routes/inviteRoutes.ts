import express from "express";
import { sendInvitation, acceptInvite } from "../controllers/emailController";

const router = express.Router();

router.post("/invite", sendInvitation);
router.get("/acceptinvite/:token", acceptInvite);

export default router;
