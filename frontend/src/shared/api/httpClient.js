import axios from "axios"
import { tokenStore } from "../utils/token"

const baseURL = import.meta.env.VITE_API_BASE_URL || "/api"

export const httpClient = axios.create({
  baseURL,
  timeout: 10000,
  withCredentials: true,
})

const refreshClient = axios.create({
  baseURL,
  timeout: 10000,
  withCredentials: true,
})

let refreshPromise = null

httpClient.interceptors.request.use((config) => {
  const accessToken = tokenStore.getAccessToken()

  if (accessToken && !config.headers?.Authorization) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const shouldRefresh =
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.skipAuthRefresh &&
      !originalRequest.url?.includes("/auth/refresh-token")

    if (!shouldRefresh) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    try {
      refreshPromise =
        refreshPromise ||
        refreshClient
          .post("/auth/refresh-token")
          .then((response) => response.data.accessToken)
          .finally(() => {
            refreshPromise = null
          })

      const newAccessToken = await refreshPromise
      tokenStore.setAccessToken(newAccessToken)

      originalRequest.headers = originalRequest.headers || {}
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

      return httpClient(originalRequest)
    } catch (refreshError) {
      tokenStore.clearAccessToken()
      return Promise.reject(refreshError)
    }
  }
)
