import { Link } from "react-router"

export default function SplashPage() {
  return (
    <div className="flex min-h-[520px] flex-col items-center justify-center text-center">
      <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-neutral-200 text-3xl">
        ...
      </div>

      <h1 className="text-3xl font-semibold tracking-tight">ChatWave</h1>
      <p className="mt-2 text-sm text-neutral-500">Real-time. Simple. Private.</p>

      <div className="mt-12 flex w-full flex-col gap-3">
        <Link
          to="/login"
          className="rounded-lg bg-neutral-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
        >
          Log in
        </Link>
        <Link
          to="/register"
          className="rounded-lg border border-neutral-200 px-4 py-3 text-sm font-medium text-neutral-900 transition hover:bg-neutral-50"
        >
          Create account
        </Link>
      </div>
    </div>
  )
}
