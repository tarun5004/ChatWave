import { useState, useEffect } from "react";
import { getConversations } from "../api/conversations.api";

const ConversationList = ({ currentUserId, onSelectConversation }) => {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const data = await getConversations();
                setConversations(data);
            } catch (err) {
                console.error("Failed to load conversations", err);
            } finally {
                setLoading(false);
            }
        };
        fetchConversations();
    }, []);

    if (loading) return <p>Loading conversations...</p>;

    return (
        <ul>
            {conversations.map((conv) => {
                const otheruser = conv.participants.find((p) => p._id !== currentUserId);
                return (
                    <li key={conv._id} onClick={() => onSelectConversation(conv)}>
                        {otheruser ? otheruser.username : "Unknown User"}
                    </li>
                );
            })}
        </ul>
    )

}

export default ConversationList;