import { useNavigate } from "react-router"
import { useAuth } from "../../auth/hooks/useAuth"

export default function ConversationsPage() {
  const navigate = useNavigate()
  const { logout, loading } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch {
      // Local auth is cleared in the rejected reducer as a fallback.
    } finally {
      navigate("/login", { replace: true })
    }
  }

  return (
    <main className="min-h-screen bg-white text-neutral-950">
      <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-5 py-8">
        <header className="flex items-center justify-between border-b border-neutral-200 pb-5">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">ChatWave</h1>
            <p className="mt-1 text-sm text-neutral-500">Conversations</p>
          </div>
          <button
            className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-900 transition hover:bg-neutral-50"
            type="button"
            disabled={loading}
            onClick={handleLogout}
          >
            {loading ? "Logging out..." : "Log out"}
          </button>
        </header>

        <div className="flex flex-1 items-center justify-center text-center">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Home / Conversations</h2>
            <p className="mt-2 text-sm text-neutral-500">Chat list UI comes next.</p>
          </div>
        </div>
      </section>
    </main>
  )
}
