import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RoleRoute = ({ children, allowed }) => {
    const { user } = useAuth();

    if (!user) return <Navigate to="/" replace />;
    if (!allowed.includes(user.role)) return <Navigate to="/unauthorized" replace />;

    return children;
};

export default RoleRoute;
