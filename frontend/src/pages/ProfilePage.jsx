import { useEffect, useState } from "react";
import axios from "axios";

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");

    const fetchProfile = async () => {
        try {
            const { data } = await axios.get(
                `${import.meta.env.VITE_API_BASE}/users/profile`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            setUser(data);
        } catch (err) {
            setError("Failed to fetch profile.");
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    if (error) return <p className="text-center text-red-500">{error}</p>;
    if (!user) return <p className="text-center">Loading profile...</p>;

    return (
        <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded shadow">
            <h2 className="text-xl font-bold mb-4 text-center">👤 Profile</h2>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>ID:</strong> {user.uniqueId}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <p><strong>Class:</strong> {user.class?.name || "N/A"}</p>
        </div>
    );
};

export default ProfilePage;
