import { useEffect, useState } from "react"
import { CheckCheck, MessageCircle } from "lucide-react"
import { getConversations } from "../api/conversations.api"
import Avatar from "../../../shared/components/Avatar"

function formatConversationTime(value) {
  if (!value) return ""

  const date = new Date(value)
  const today = new Date()
  const isToday = date.toDateString() === today.toDateString()

  return isToday
    ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : date.toLocaleDateString([], { day: "2-digit", month: "short" })
}

const ConversationList = ({
  currentUserId,
  activeConversationId,
  onSelectConversation,
}) => {
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const data = await getConversations();
                setConversations(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Failed to load conversations", err);
            } finally {
                setLoading(false);
            }
        };
        fetchConversations();
    }, []);

  if (loading) {
    return (
      <div className="space-y-1 p-2" aria-label="Loading conversations">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="flex animate-pulse items-center gap-3 px-3 py-3">
            <div className="h-12 w-12 rounded-full bg-neutral-200" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-28 rounded bg-neutral-200" />
              <div className="h-3 w-44 rounded bg-neutral-100" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center text-neutral-500">
        <MessageCircle size={30} strokeWidth={1.5} />
        <p className="mt-3 text-sm font-medium text-neutral-700">No conversations yet</p>
        <p className="mt-1 text-xs leading-5">Search for someone to start chatting.</p>
      </div>
    )
  }

    return (
        <ul className="min-h-0 flex-1 overflow-y-auto">
            {conversations.map((conv) => {
                const otheruser = conv.participants.find(
                  (participant) => String(participant?._id) !== String(currentUserId),
                );
                const isActive = String(activeConversationId) === String(conv._id)
                return (
                    <li key={conv._id}>
                      <button
                        type="button"
                        className={`flex w-full items-center gap-3 border-b border-neutral-100 px-4 py-3 text-left transition hover:bg-neutral-50 ${isActive ? "bg-[#f0f2f5]" : "bg-white"}`}
                        onClick={() => onSelectConversation(conv)}
                      >
                        <Avatar name={otheruser?.username} size="md" />
                        <span className="min-w-0 flex-1">
                          <span className="flex items-baseline justify-between gap-3">
                            <span className="truncate text-sm font-semibold text-neutral-900">
                              {otheruser?.username || "Unknown user"}
                            </span>
                            <span className="shrink-0 text-[11px] text-neutral-400">
                              {formatConversationTime(conv.lastMessageAt)}
                            </span>
                          </span>
                          <span className="mt-1 flex items-center gap-1 text-xs text-neutral-500">
                            <CheckCheck size={15} className="shrink-0 text-sky-500" />
                            <span className="truncate">
                              {otheruser?.email || "Open conversation"}
                            </span>
                          </span>
                        </span>
                      </button>
                    </li>
                );
            })}
        </ul>
    )

}

export default ConversationList;
