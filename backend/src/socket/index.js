import {Server} from 'socket.io';
import {socketAuthMiddleware} from './socket.auth.js';

export const initSocket = (httpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true
        },
    });

    io.use(socketAuthMiddleware); // Apply the authentication middleware to all incoming socket connections

    io.on("connection", (socket) => {
        const userId = socket.user._id; // Access the authenticated user object attached in the middleware
        console.log(`User connected: ${userId}`);

        // join the user to a personal room based on their userId
        socket.join(userId);

        // Handle Disconnect event
        socket.on("disconnect", () => {
            console.log(`User disconnected: ${userId}`);
        });
    });
    return io; // Return the io instance for further use if needed
};