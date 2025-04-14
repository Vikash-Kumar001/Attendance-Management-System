import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow">
            <Link to="/" className="text-xl font-bold">
                🎓 Attendance System
            </Link>

            {user ? (
                <div className="flex items-center gap-4 text-sm">
                    <span>
                        {user.name} ({user.role})
                    </span>

                    {user.role === "admin" && (
                        <Link to="/register" className="hover:underline">
                            Register User
                        </Link>
                    )}

                    <Link to="/profile" className="hover:underline">
                        Profile
                    </Link>

                    <button
                        onClick={logout}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                        Logout
                    </button>
                </div>
            ) : (
                <Link to="/" className="hover:underline">
                    Login
                </Link>
            )}
        </nav>
    );
};

export default Navbar;
