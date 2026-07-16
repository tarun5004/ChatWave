import messageModel from '../models/message.model.js';

// ------------------------Get Messages by conversationId------------------------

export const getMessagesByConversation = async (conversationId, {page = 1, limit = 30} = {}) => {
    const skip = (page - 1) * limit;
    return await messageModel
    .find({ conversationId })
    .sort({ createdAt: -1 }) // Sort by createdAt in descending order
    .skip(skip)
    .limit(limit)
    .lean(); // Return plain JavaScript objects instead of Mongoose documents
};