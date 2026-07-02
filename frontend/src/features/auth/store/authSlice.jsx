import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { authApi } from "../api/auth.api"

const initialState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,
}

// -----------------Async thunks for register, login, getMe, and logout-----------------
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await authApi.register(payload)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Register failed")
    }
  }
)

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await authApi.login(payload)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed")
    }
  }
)

export const getMe = createAsyncThunk(
  "auth/getMe",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { accessToken } = getState().auth
      const response = await authApi.getMe(accessToken)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Get me failed")
    }
  }
)

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logout()
      return true
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Logout failed")
    }
  }
)


// -----------------Auth slice with reducers and extraReducers-----------------
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuth(state) {
      state.user = null
      state.accessToken = null
      state.isAuthenticated = false
      state.error = null
      localStorage.removeItem("accessToken")
    },
    // ✅ HYDRATE: Load token from localStorage on app mount
    hydrateAuth(state, action) {
      state.accessToken = action.payload
      state.isAuthenticated = !!action.payload
    },
  },

  // -----------------Extra reducers for handling async thunks-----------------
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.accessToken = action.payload.accessToken
        state.isAuthenticated = true
        // ✅ PERSIST: Save token to localStorage
        localStorage.setItem("accessToken", action.payload.accessToken)
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.accessToken = action.payload.accessToken
        state.isAuthenticated = true
        // ✅ PERSIST: Save token to localStorage
        localStorage.setItem("accessToken", action.payload.accessToken)
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      .addCase(getMe.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.isAuthenticated = true
      })
      .addCase(getMe.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.accessToken = null
        state.isAuthenticated = false
        state.loading = false
        state.error = null
        // ✅ CLEAR: Remove token from localStorage
        localStorage.removeItem("accessToken")
      })
  },
})

export const { clearAuth, hydrateAuth } = authSlice.actions
export default authSlice.reducer