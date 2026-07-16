import httpClient from "../../../shared/api/httpClient";

export const openConversation = async (recipientId) => {
    const response = await httpClient.post("/conversations/open", { recipientId });
    return response.data.conversation;
};

// -----------------------------List All Conversations for a User---------------------------------
export const getConversations = async () => {
    const response = await httpClient.get("/conversations");
    return response.data.conversations;
}

// -----------------------------Get Message History for a Conversation---------------------------------
export const getMessageHistory = async (conversationId) => {
    const response = await httpClient.get(`/conversations/${conversationId}/messages`);
    return response.data.messages;
};