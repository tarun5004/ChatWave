import { useState } from "react"
import { Link } from "react-router"

const initialForm = {
  email: "",
  password: "",
}

export default function LoginPage() {
  const [form, setForm] = useState(initialForm)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
  }

  return (
    <div>
      <div className="mb-8">
        <div className="mb-7 h-8 w-8 rounded-full border border-rose-400" />
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="mt-2 text-sm text-neutral-500">Log in to continue</p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <label className="block">
          <span className="text-xs font-semibold text-neutral-800">Email or username</span>
          <input
            className="mt-2 w-full rounded-lg border border-neutral-200 px-3 py-3 text-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-900"
            name="email"
            type="text"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter email or username"
            autoComplete="username"
          />
        </label>

        <label className="block">
          <span className="text-xs font-semibold text-neutral-800">Password</span>
          <div className="mt-2 flex rounded-lg border border-neutral-200 focus-within:border-neutral-900">
            <input
              className="w-full rounded-lg px-3 py-3 text-sm outline-none placeholder:text-neutral-400"
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              placeholder="Enter password"
              autoComplete="current-password"
            />
            <button
              className="px-3 text-xs font-medium text-neutral-500"
              type="button"
              onClick={() => setShowPassword((currentValue) => !currentValue)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </label>

        <button
          className="w-full rounded-lg bg-neutral-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
          type="submit"
        >
          Log in
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-neutral-500">
        Do not have an account?{" "}
        <Link className="font-semibold text-neutral-950" to="/register">
          Sign up
        </Link>
      </p>
    </div>
  )
}
