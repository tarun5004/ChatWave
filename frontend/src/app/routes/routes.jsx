import { createBrowserRouter, Navigate, RouterProvider } from "react-router"
import AuthLayout from "../layouts/authLayout"
import LoginPage from "../../features/auth/pages/LoginPage"
import RegisterPage from "../../features/auth/pages/RegisterPage"
import SplashPage from "../../features/auth/pages/SplashPage"
import ProtectedRoute from "./ProtectedRoutes"
import ChatPage from "../../features/chat/pages/ChatPage"

const router = createBrowserRouter([
  {
    // Public routes
    element: <AuthLayout />,
    children: [
      { path: "/", element: <SplashPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
    ],
  },


  // Protected routes
  {
    path: "/conversations",
    element: (
      <ProtectedRoute>
        <ChatPage />
      </ProtectedRoute>
    ),
  },
  { path: "*", element: <Navigate to="/" replace /> },
])

export default function AppRoutes() {
  return <RouterProvider router={router} />
}