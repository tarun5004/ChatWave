// frontend/src/features/chat/pages/ChatPage.jsx
import { useState } from "react";
import { useSelector } from "react-redux";
import UserSearch from "../../users/components/UserSearch";
import { openConversation } from "../../conversations/api/conversations.api";
import ConversationList from "../../conversations/components/ConversationList";

const ChatPage = () => {
    const [activeConversation, setActiveConversation] = useState(null);
    const currentUserId = useSelector((state) => state.auth.user?._id);
// -------------------------Handle User Selection-------------------------
    const handleUserSelect = async (user) => {
        try {
            const conversation = await openConversation(user._id);
            setActiveConversation(conversation);
        } catch (err) {
            console.error("Failed to open conversation", err);
        }
    };

// -------------------------Handle Conversation Selection-------------------------
    const handleConversationSelect = (conversation) => {
        setActiveConversation(conversation);
    };

    return (
        <div>
            <UserSearch onSelectUser={handleUserSelect} />
            <ConversationList currentUserId={currentUserId} onSelectConversation={handleConversationSelect} />
            {activeConversation && <div>Conversation opened: {activeConversation._id}</div>}
        </div>
    );
};

export default ChatPage;