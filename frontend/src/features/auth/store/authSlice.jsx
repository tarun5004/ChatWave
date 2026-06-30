import {createSlice} from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        accessToken: null,
        isAuthenticated: false,
        loading: false,
        error: null
    },
    reducers: {
        // Define your reducers here
        setUser(state, action) {
            state.user = action.payload;
            state.isAuthenticated = true;
        },
        setAccessToken(state, action) {
            state.accessToken = action.payload;
        },
        setError(state, action) {
            state.error = action.payload;
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
    }
})

export const { setUser, setAccessToken, setError, setLoading } = authSlice.actions;
export default authSlice.reducer;