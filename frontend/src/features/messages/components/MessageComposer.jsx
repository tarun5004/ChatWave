import { Paperclip, SendHorizontal, Smile } from "lucide-react"

export default function MessageComposer({ disabled = false, onSend }) {
  const isDisabled = disabled || !onSend

  const handleSubmit = (event) => {
    event.preventDefault()

    const message = new FormData(event.currentTarget)
      .get("message")
      ?.toString()
      .trim()

    if (!message || !onSend) return

    onSend(message)
    event.currentTarget.reset()
  }

  return (
    <form
      className="flex min-h-16 items-center gap-2 border-t border-neutral-200 bg-[#f0f2f5] px-3 py-2 sm:px-4"
      onSubmit={handleSubmit}
    >
      <button
        type="button"
        className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-neutral-500 transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
        disabled
        title="Emoji picker"
        aria-label="Open emoji picker"
      >
        <Smile size={21} strokeWidth={1.8} />
      </button>
      <button
        type="button"
        className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-neutral-500 transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
        disabled
        title="Attach file"
        aria-label="Attach file"
      >
        <Paperclip size={21} strokeWidth={1.8} />
      </button>
      <input
        name="message"
        className="h-11 min-w-0 flex-1 rounded-lg border border-transparent bg-white px-4 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-500 focus:border-emerald-500 disabled:cursor-not-allowed disabled:bg-white"
        placeholder="Type a message"
        autoComplete="off"
        disabled={isDisabled}
      />
      <button
        type="submit"
        className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald-600 text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-neutral-300"
        disabled={isDisabled}
        title="Send message"
        aria-label="Send message"
      >
        <SendHorizontal size={19} strokeWidth={2} />
      </button>
    </form>
  )
}
