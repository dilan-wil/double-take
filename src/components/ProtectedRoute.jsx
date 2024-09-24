import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../functions/firebase"; // Import Firebase Auth instance

const ProtectedRoute = ({ children }) => {
    const [user, loading] = useAuthState(auth); // Use Firebase hook to get auth state
    if (loading) {
        return <div>Loading...</div>; // Or a spinner/loader component
    }

    if (!user) {
        return <Navigate to="/auth/login" />; // Redirect to login if not authenticated
    }

    return children; // Render the protected component if authenticated
};

export default ProtectedRoute;
