import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { useAuth } from "../../auth/hooks/useAuth"
import { getConversations } from "../api/conversations.api.js"

export default function ConversationsPage() {
  const navigate = useNavigate()

  const {
    user,
    logout,
    loading: authLoading,
  } = useAuth()

  const [conversations, setConversations] = useState([])
  const [conversationsLoading, setConversationsLoading] = useState(true)
  const [conversationsError, setConversationsError] = useState("")

  useEffect(() => {
    const loadConversations = async () => {
      try {
        setConversationsLoading(true)
        setConversationsError("")

        const data = await getConversations()
        setConversations(data)
      } catch (error) {
        setConversationsError(
          error.response?.data?.message ||
            "Unable to fetch conversations. Please try again later."
        )
      } finally {
        setConversationsLoading(false)
      }
    }

    loadConversations()
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
    } catch {
      // Redux clears local authentication if logout request fails.
    } finally {
      navigate("/login", { replace: true })
    }
  }

  return (
    <main className="min-h-screen bg-white text-neutral-950">
      <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-5 py-8">
        <header className="flex items-center justify-between border-b border-neutral-200 pb-5">
          <div>
            <h1 className="text-xl font-semibold">ChatWave</h1>
            <p className="mt-1 text-sm text-neutral-500">
              Conversations
            </p>
          </div>

          <button
            type="button"
            disabled={authLoading}
            onClick={handleLogout}
            className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {authLoading ? "Logging out..." : "Log out"}
          </button>
        </header>

        <div className="py-6">
          {conversationsLoading && (
            <p className="text-sm text-neutral-500">
              Loading conversations...
            </p>
          )}

          {conversationsError && (
            <p className="text-sm text-red-600">
              {conversationsError}
            </p>
          )}

          {!conversationsLoading &&
            !conversationsError &&
            conversations.length === 0 && (
              <p className="text-sm text-neutral-500">
                No conversations found.
              </p>
            )}

          {!conversationsLoading && !conversationsError && (
            <div className="divide-y divide-neutral-200">
              {conversations.map((conversation) => {
                const otherUser = conversation.participants.find(
                  (participant) =>
                    String(participant._id) !== String(user?._id)
                )

                return (
                  <div
                    key={conversation._id}
                    className="py-4"
                  >
                    <h2 className="font-medium">
                      {otherUser?.username || "Unknown user"}
                    </h2>

                    <p className="text-sm text-neutral-500">
                      {otherUser?.email || "Email unavailable"}
                    </p>

                    <p className="mt-1 text-xs text-neutral-400">
                      Last activity:{" "}
                      {new Date(
                        conversation.lastMessageAt
                      ).toLocaleString()}
                    </p>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}