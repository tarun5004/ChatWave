import http from 'http';
import app from "./src/app.js";
import {initSocket} from "./src/socket/index.js";
import connectDB from "./src/config/db.js";

await connectDB(); // Connect to the database before starting the server

const httpServer = http.createServer(app);
const socketServer = initSocket(httpServer); // Initialize the socket server with the HTTP server

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});