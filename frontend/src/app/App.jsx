import { AppProviders } from "./store/providers"
import {useEffect} from "react"
import { useDispatch } from "react-redux"
import { hydrateAuth, getMe } from "../features/auth/store/authSlice"
import AppRoutes from "./routes"

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    // ✅ HYDRATE: Load token from localStorage on app mount
    const accessToken = localStorage.getItem("accessToken")
    if (accessToken) {
      dispatch(hydrateAuth(accessToken))
      dispatch(getMe())
    }
  }, [dispatch])
  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  )
}

export default App
