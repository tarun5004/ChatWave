import express from "express";
import * as conversationController from "../controllers/conversation.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

// -----------------------------Open Conversation Between Two Users---------------------------------
router.post("/", authenticateUser, conversationController.openConversation);
router.post("/open", authenticateUser, conversationController.openConversation);

export default router;
