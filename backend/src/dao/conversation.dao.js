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
