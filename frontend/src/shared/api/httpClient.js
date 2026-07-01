import axios from 'axios';
import {tokenStore} from '../utils/token';


const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// -----------------Create an Axios instance with the base URL-----------------
export const httpClient = axios.create({
    baseURL,
    timeout: 5000, // Set a timeout for requests (optional)
    withCredentials: true, // Include credentials (cookies) in requests 
})


// -----------------Create a separate Axios instance for refresh token requests-----------------

// Never use httpClient for refresh token requests.
// Otherwise a 401 on /refresh can trigger the interceptor again, causing an infinite refresh loop.

const refreshClient = axios.create({
    baseURL,
    timeout: 5000,
    withCredentials: true,
})

/**
 * Browser ko allow karna ki cross-origin request ke saath cookies bhi bheje.

Dhyan do:

HttpOnly → JavaScript cookie read nahi kar sakti.
withCredentials → Browser request ke saath cookie bhejega ya nahi, ye decide karta hai.

refreshClient
    │
    ├── Only /auth/refresh
    ├── No Auth Interceptors
    └── Prevents Infinite Refresh Loop

 */




// -----------------Request Interceptor-----------------

/**
 * httpClient
    │
    ├── All Protected APIs
    ├── Adds Authorization Header
    └── Has Auth Interceptors
 */
httpClient.interceptors.request.use(
    (config) => {
        const token = tokenStore.getAccessToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    }
)

//---------------------Response Interceptor-----------------

httpClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const response = await refreshClient.post('/auth/refresh');
                const newAccessToken = response.data.accessToken;

                tokenStore.setAccessToken(newAccessToken);
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

                return httpClient(originalRequest);
            }catch (refreshError) {
                // Handle refresh token error (e.g., redirect to login)
                tokenStore.clearAccessToken();
                window.dispatchEvent(new Event("auth:expired")); // Notify the app about token expiration
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
)