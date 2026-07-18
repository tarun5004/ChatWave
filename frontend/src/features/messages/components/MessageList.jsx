// frontend/src/features/messages/components/MessageList.jsx
import { useState, useEffect } from "react";
import { CheckCheck, MessageCircle } from "lucide-react";
import { getMessageHistory } from "../../conversations/api/conversations.api";

const MessageList = ({ conversationId, currentUserId }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!conversationId) return; // koi conversation select hi nahi hui abhi

        let ignore = false; // maen useEffect ke andar ek flag set kiya hai, jisse hum ye track kar sake ki kya component abhi bhi mounted hai ya nahi. Agar component unmount ho jaye, toh hum API response ko ignore kar denge.
// mount and unmount means component ke mount hone aur unmount hone ka time like when component is added to the DOM and removed from the DOM. Agar component unmount ho jaye, toh hum API response ko ignore kar denge, taki hum state update na karein aur memory leak na ho.
        const fetchMessages = async () => {
            setLoading(true);
            try {
                const data = await getMessageHistory(conversationId);
                if (!ignore) {
                    setMessages(Array.isArray(data) ? [...data].reverse() : []);
                }
            } catch (err) {
                console.error("Failed to load messages", err);
            } finally {
                if (!ignore) setLoading(false);
            }
        };

        fetchMessages();

        return () => { ignore = true; }; // conversationId badalte hi purana result "invalid" ho jaata hai
    }, [conversationId]); // <-- sirf ID, poora object nahi

    if (loading) {
        return (
            <div className="flex flex-1 items-center justify-center text-sm text-neutral-500">
                Loading messages...
            </div>
        );
    }

    if (messages.length === 0) {
        return (
            <div className="flex flex-1 flex-col items-center justify-center px-6 text-center text-neutral-500">
                <MessageCircle size={34} strokeWidth={1.4} />
                <p className="mt-3 text-sm font-medium text-neutral-700">No messages yet</p>
                <p className="mt-1 text-xs">Start the conversation when you are ready.</p>
            </div>
        );
    }

    return (
        <ul className="chat-wallpaper flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto px-4 py-5 sm:px-8">
            {messages.map((msg) => {
                const senderId = typeof msg.senderId === "object"
                    ? msg.senderId?._id
                    : msg.senderId;
                const isMine = String(senderId) === String(currentUserId);

                return (
                    <li
                        key={msg._id}
                        className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`max-w-[82%] rounded-lg px-3 py-2 shadow-sm sm:max-w-[65%] ${isMine ? "rounded-tr-sm bg-[#d9fdd3]" : "rounded-tl-sm bg-white"}`}
                        >
                            <p className="whitespace-pre-wrap break-words text-sm leading-5 text-neutral-900">
                                {msg.text}
                            </p>
                            <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-neutral-500">
                                <span>
                                    {msg.createdAt
                                        ? new Date(msg.createdAt).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })
                                        : ""}
                                </span>
                                {isMine && msg.delivered ? (
                                    <CheckCheck size={14} className="text-sky-500" />
                                ) : null}
                            </div>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
};

export default MessageList;
