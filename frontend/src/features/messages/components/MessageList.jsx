// frontend/src/features/messages/components/MessageList.jsx
import { useState, useEffect } from "react";
import { getMessages } from "../../conversations/api/conversations.api";

const MessageList = ({ conversationId, currentUserId }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!conversationId) return; // koi conversation select hi nahi hui abhi

        let ignore = false; // Q3 ka fix — race condition guard

        const fetchMessages = async () => {
            setLoading(true);
            try {
                const data = await getMessages(conversationId);
                if (!ignore) setMessages([...data].reverse()); // oldest→newest, display ke liye
            } catch (err) {
                console.error("Failed to load messages", err);
            } finally {
                if (!ignore) setLoading(false);
            }
        };

        fetchMessages();

        return () => { ignore = true; }; // conversationId badalte hi purana result "invalid" ho jaata hai
    }, [conversationId]); // <-- sirf ID, poora object nahi

    if (loading) return <p>Loading messages...</p>;

    return (
        <ul>
            {messages.map((msg) => (
                <li key={msg._id} style={{ textAlign: msg.senderId === currentUserId ? "right" : "left" }}>
                    {msg.text}
                </li>
            ))}
        </ul>
    );
};

export default MessageList;