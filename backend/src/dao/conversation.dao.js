import conversationModel from "../models/conversation.model.js";

//-----------------------------Find Conversation Between Two Users---------------------------------
export const findConversationBetween = async (userId1, userId2) => {
    return await conversationModel.findOne({
        participants: {$all: [userId1, userId2]},  // Use $all to ensure both user IDs are present in the participants array
    });
};


//-----------------------------Create Conversation Between Two Users---------------------------------
export const createConversation = async (userId1, userId2) => {
    return await conversationModel.create({
        participants: [userId1, userId2],
    });
};


// -----------------------------Get All Conversations for a User---------------------------------
export const getConversationsForUser = async (userId) => {
    return await conversationModel
    .find({ participants: userId })
    .sort({ lastMessageAt: -1 })  // Sort by lastMessageAt in descending order
    .populate('participants', 'username email')  // Populate participants with username and email
    .lean();  // Use lean() for better performance if you don't need Mongoose documents
}

// -----------------------------Get Conversation by ID---------------------------------
export const getConversationById = async (conversationId) => {
    return await conversationModel.findById(conversationId)
}