import * as messageDao from "../dao/message.dao.js";
import * as conversationDao from "../dao/conversation.dao.js";

export const getMessageHistory = async (req, res, next) => {
    try {
        const { conversationId } = req.params;
        const conversation = await conversationDao.getConversationById(conversationId);
        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found" });
        }

        const isParticipant = conversation.participants.some(
            (p) => p.toString() === req.user._id.toString()
        );
        if (!isParticipant) {
            return res.status(403).json({ message: "You are not a participant in this conversation" });
        }

        const messages = await messageDao.getMessagesByConversation(conversationId, req.query);
        res.json(messages);
    } catch (error) {
        next(error);
    }
}