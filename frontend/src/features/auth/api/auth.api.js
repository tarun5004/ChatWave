import { httpClient } from "../../../shared/api/httpClient"

export const authApi = {
  register(payload) {
    return httpClient.post("/auth/register", payload)
  },

  login(payload) {
    return httpClient.post("/auth/login", payload)
  },

  getMe() {
    return httpClient.get("/auth/me")
  },

  refreshAccessToken() {
    return httpClient.post("/auth/refresh-token", undefined, { skipAuthRefresh: true })
  },

  logout() {
    return httpClient.post("/auth/logout", undefined, { skipAuthRefresh: true })
  },
}
