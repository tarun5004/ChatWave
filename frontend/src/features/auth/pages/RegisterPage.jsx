import { useState } from "react"
import { Link, useNavigate } from "react-router"
import {useAuth} from "../hooks/useAuth"

const initialForm = {
  username: "",
  email: "",
  password: "",
}

export default function RegisterPage() {
  const [form, setForm] = useState(initialForm)
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()
  const {register, loading, error} = useAuth()

// Handle input changes handleChange function is called whenever the user types in any of the input fields. It updates the form state with the new values.
  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }


  // Handle form submission handleSubmit function is called when the user submits the registration form. It prevents the default form submission behavior, calls the register function from the useAuth hook with the form data, and navigates to the conversations page upon successful registration.
  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      await register(form)
      navigate("/conversations")
    } catch (error) {
      console.error("Registration failed:", error)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <div className="mb-7 h-8 w-8 rounded-full border border-rose-400" />
        <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
        <p className="mt-2 text-sm text-neutral-500">Join ChatWave today</p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <label className="block">
          <span className="text-xs font-semibold text-neutral-800">Username</span>
          <input
            className="mt-2 w-full rounded-lg border border-neutral-200 px-3 py-3 text-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-900"
            name="username"
            type="text"
            value={form.username}
            onChange={handleChange}
            placeholder="Choose a username"
            autoComplete="username"
          />
        </label>

        <label className="block">
          <span className="text-xs font-semibold text-neutral-800">Email</span>
          <input
            className="mt-2 w-full rounded-lg border border-neutral-200 px-3 py-3 text-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-900"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
            autoComplete="email"
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
              placeholder="Create a password"
              autoComplete="new-password"
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

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          className="w-full rounded-lg bg-neutral-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-400"
          type="submit"
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign up"} 
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-neutral-500">
        Already have an account?{" "}
        <Link className="font-semibold text-neutral-950" to="/login">
          Log in
        </Link>
      </p>
    </div>
  )
}
