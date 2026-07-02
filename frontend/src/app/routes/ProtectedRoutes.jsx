import { Navigate } from "react-router";
import { useAuth } from "../../features/auth/hooks/useAuth";

export default function ProtectedRoutes({ children }) {
    const { isAuthenticated } = useAuth();  // Access the isAuthenticated state from the useAuth hook

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}