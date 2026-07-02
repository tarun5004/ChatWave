import { Outlet } from "react-router"

export default function AuthLayout() {
  return (
    <main className="min-h-screen bg-white text-neutral-950">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-5 py-10">
        <section className="w-full max-w-[460px] rounded-2xl border border-neutral-200 bg-white p-7 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <Outlet />
        </section>
      </div>
    </main>
  )
}
