import { useState } from "react"
import { useSelector } from "react-redux"
import { ArrowLeft, LockKeyhole, MessageCircle } from "lucide-react"
import UserSearch from "../../users/components/UserSearch"
import { openConversation } from "../../conversations/api/conversations.api"
import ConversationList from "../../conversations/components/ConversationList"
import MessageList from "../../messages/components/MessageList"
import MessageComposer from "../../messages/components/MessageComposer"
import Avatar from "../../../shared/components/Avatar"

function getOtherParticipant(conversation, currentUserId) {
  return conversation?.participants?.find(
    (participant) => String(participant?._id) !== String(currentUserId),
  )
}

const ChatPage = () => {
  const [activeConversation, setActiveConversation] = useState(null) //For set active conversation when user clicks on a conversation from the list or selects a user from the search results
  const currentUser = useSelector((state) => state.auth.user)  // Get the current logged-in user from the Redux store
  const currentUserId = currentUser?._id // Get the current user's ID for comparison and API calls
  const activeUser = getOtherParticipant(activeConversation, currentUserId)  // Get the other participant in the active conversation for display purposes

  const handleUserSelect = async (user) => {
    try {
      const conversation = await openConversation(user._id)
      setActiveConversation(conversation)
    } catch (err) {
      console.error("Failed to open conversation", err)
    }
  }

// -------------------------Handle Conversation Selection-------------------------
  const handleConversationSelect = (conversation) => {
    setActiveConversation(conversation)
  }

  return (
    <main className="h-dvh overflow-hidden bg-[#dfe3e5] text-neutral-950">
      <div className="mx-auto grid h-full w-full max-w-[1440px] grid-cols-1 overflow-hidden bg-white shadow-xl md:grid-cols-[minmax(320px,390px)_minmax(0,1fr)] md:border-x md:border-neutral-300">
        <aside
          className={`${activeConversation ? "hidden md:flex" : "flex"} min-h-0 flex-col border-r border-neutral-200 bg-white`}
        >
          <header className="flex min-h-16 items-center justify-between bg-[#f0f2f5] px-4">
            <div className="flex min-w-0 items-center gap-3">
              <Avatar name={currentUser?.username} size="sm" online />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-neutral-900">
                  {currentUser?.username || "ChatWave user"}
                </p>
                <p className="text-xs text-emerald-700">Online</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-emerald-700">
              <MessageCircle size={22} strokeWidth={1.8} aria-hidden="true" />
              <span className="text-sm font-semibold">ChatWave</span>
            </div>
          </header>

          <UserSearch onSelectUser={handleUserSelect} />

          <div className="flex min-h-0 flex-1 flex-col">
            <div className="border-b border-neutral-100 px-4 py-3">
              <h1 className="text-base font-semibold">Chats</h1>
            </div>
            <ConversationList
              currentUserId={currentUserId}
              activeConversationId={activeConversation?._id}
              onSelectConversation={handleConversationSelect}
            />
          </div>
        </aside>

        <section
          className={`${activeConversation ? "flex" : "hidden md:flex"} min-h-0 flex-col bg-[#efeae2]`}
        >
          {activeConversation ? (
            <>
              <header className="flex min-h-16 items-center gap-3 border-b border-neutral-200 bg-[#f0f2f5] px-3 sm:px-4">
                <button
                  type="button"
                  className="grid h-10 w-10 place-items-center rounded-full text-neutral-600 transition hover:bg-neutral-200 md:hidden"
                  onClick={() => setActiveConversation(null)}
                  title="Back to conversations"
                  aria-label="Back to conversations"
                >
                  <ArrowLeft size={21} />
                </button>
                <Avatar name={activeUser?.username} size="sm" online />
                <div className="min-w-0">
                  <h2 className="truncate text-sm font-semibold text-neutral-900">
                    {activeUser?.username || "Conversation"}
                  </h2>
                  <p className="text-xs text-neutral-500">Online</p>
                </div>
              </header>

              <MessageList
                conversationId={activeConversation._id}
                currentUserId={currentUserId}
              />
              <MessageComposer />
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
              <div className="grid h-24 w-24 place-items-center rounded-full bg-white text-emerald-600 shadow-sm">
                <MessageCircle size={44} strokeWidth={1.35} />
              </div>
              <h2 className="mt-6 text-2xl font-light text-neutral-800">
                ChatWave Web
              </h2>
              <p className="mt-2 max-w-sm text-sm leading-6 text-neutral-500">
                Select a conversation to view your messages.
              </p>
              <div className="mt-8 flex items-center gap-2 text-xs text-neutral-500">
                <LockKeyhole size={14} />
                Private conversations
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

export default ChatPage
