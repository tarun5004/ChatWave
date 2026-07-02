import { httpClient } from "../../../shared/api/httpClient"

const authHeader = (accessToken) => ({
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
})

export const authApi = {
  register(payload) {
    return httpClient.post("/auth/register", payload)
  },

  login(payload) {
    return httpClient.post("/auth/login", payload)
  },

  getMe(accessToken) {
    return httpClient.get("/auth/me", authHeader(accessToken))
  },

  logout() {
    return httpClient.post("/auth/logout")
  },
}