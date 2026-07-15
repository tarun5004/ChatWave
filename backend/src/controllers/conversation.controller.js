import { isValidObjectId } from "mongoose";
import * as conversationDao from "../dao/conversation.dao.js";
import * as userDao from "../dao/user.dao.js";


// -----------------------------Open or Create Conversation Between Two Users---------------------------------

export const openConversation = async ( req, res, next) => {
    try {
        const currentUserId = req.user._id;
        const { recipientId } = req.body; 

        if (!recipientId) {
            return res.status(400).json({ message: "Recipient ID is required." });
        }

        if (!isValidObjectId(recipientId)) {
            return res.status(400).json({ message: "Recipient ID must be a valid user id." });
        }

        if (currentUserId.toString() === recipientId) {
            return res.status(400).json({ message: "You cannot open a conversation with yourself." });
        }

        // Check if the recipient exists
        const recipient = await userDao.getUserById(recipientId);
        if (!recipient) {
            return res.status(404).json({ message: "Recipient not found." });
        }

        let conversation = await conversationDao.findConversationBetween(currentUserId, recipientId);
        const statusCode = conversation ? 200 : 201;

        if (!conversation) {
            conversation = await conversationDao.createConversation(currentUserId, recipientId);
        }

        return res.status(statusCode).json({ conversation });


    } catch (error) {
        next(error);
    }
};

// -----------------------------------List All Conversations for a User-----------------------------------
export const ListConversations =  async (req, res, next) => {
    try {
        const conversations = await conversationDao.getConversationsForUser(req.user._id);
        return res.status(200).json({ conversations });
    } catch (error) {
        next(error);
    }
}
