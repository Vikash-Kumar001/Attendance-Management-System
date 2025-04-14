import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const fetchProfile = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_BASE}/users/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser(data);
        } catch (error) {
            console.error("Auth error:", error);
            localStorage.removeItem("token");
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        window.location.href = "/";
    };

    return (
        <AuthContext.Provider value={{ user, setUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
