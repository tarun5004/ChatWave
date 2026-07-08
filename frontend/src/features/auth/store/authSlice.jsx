import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { authApi } from "../api/auth.api"
import { tokenStore } from "../../../shared/utils/token"

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
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.getMe()
      return {
        ...response.data,
        accessToken: tokenStore.getAccessToken(),
      }
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
      state.loading = false
      state.error = null
    },
    hydrateAuth(state, action) {
      state.accessToken = action.payload
      state.isAuthenticated = !!action.payload
      state.error = null
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
        state.accessToken = action.payload.accessToken || state.accessToken
        state.isAuthenticated = true
      })
      .addCase(getMe.rejected, (state, action) => {
        state.loading = false
        state.user = null
        state.accessToken = null
        state.isAuthenticated = false
        state.error = action.payload
      })

      .addCase(logoutUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.accessToken = null
        state.isAuthenticated = false
        state.loading = false
        state.error = null
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.user = null
        state.accessToken = null
        state.isAuthenticated = false
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearAuth, hydrateAuth } = authSlice.actions
export default authSlice.reducer
