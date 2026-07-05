import {configureStore} from '@reduxjs/toolkit';
import authReducer from '../../features/auth/store/authSlice';
import { tokenStore } from '../../shared/utils/token';

const persistedAccessToken = tokenStore.getAccessToken();

export const store = configureStore({
    reducer: {
        auth: authReducer
    },
    preloadedState: {
        auth: {
            user: null,
            accessToken: persistedAccessToken,
            isAuthenticated: Boolean(persistedAccessToken),
            loading: false,
            error: null,
        },
    },
});

let currentAccessToken = persistedAccessToken;

store.subscribe(() => {
    const nextAccessToken = store.getState().auth.accessToken;

    if (nextAccessToken === currentAccessToken) {
        return;
    }

    currentAccessToken = nextAccessToken;

    if (nextAccessToken) {
        tokenStore.setAccessToken(nextAccessToken);
    } else {
        tokenStore.clearAccessToken();
    }
});
