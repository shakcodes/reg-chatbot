import express from "express";
import { getSession, clearSession, getAllSessions } from "../controllers/sessionController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getAllSessions);         // ✅ all sessions list
router.get("/:sessionId", protect, getSession);   // ✅ single session
router.delete("/:sessionId", protect, clearSession);

export default router;
