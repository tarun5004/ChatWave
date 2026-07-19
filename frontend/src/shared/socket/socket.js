import { io } from "socket.io-client";

let socket = null; // Initialize socket variable

export const connectSocket = (accessToken) => {
    socket = io(import.meta.env.VITE_SOCKET_URL, {
        auth: {
            token: accessToken, // Pass the access token in the auth object
        }
    });
    return socket; // Return the socket instance for further use
}

export const getSocket = () => socket; // Function to get the current socket instance

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect(); // Disconnect the socket if it exists
        socket = null; // Reset the socket variable
    }
}