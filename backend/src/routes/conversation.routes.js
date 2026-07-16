import express from "express";
import * as conversationController from "../controllers/conversation.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import * as messageController from "../controllers/message.controller.js";

const router = express.Router();

// -----------------------------Open Conversation Between Two Users---------------------------------
router.post("/", authenticateUser, conversationController.openConversation);
router.post("/open", authenticateUser, conversationController.openConversation);
router.get("/", authenticateUser, conversationController.ListConversations);

router.get("/:conversationId/messages", authenticateUser, messageController.getMessageHistory);

export default router;
