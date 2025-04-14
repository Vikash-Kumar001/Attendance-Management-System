import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const AdminDashboard = () => {
    const { user } = useAuth();
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        uniqueId: "",
        role: "student",
        class: "",
    });

    const [classes, setClasses] = useState([]);
    const [users, setUsers] = useState([]);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        fetchClasses();
        fetchUsers();
    }, []);

    const fetchClasses = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE}/classes`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setClasses(res.data);
        } catch (err) {
            console.error("Failed to fetch classes");
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE}/users/all`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setUsers(res.data);
        } catch (err) {
            console.error("Failed to fetch users");
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess("");
        setError("");

        try {
            await axios.post(`${import.meta.env.VITE_API_BASE}/users/register`, form, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            setForm({
                name: "",
                email: "",
                password: "",
                uniqueId: "",
                role: "student",
                class: "",
            });

            fetchUsers();
            setSuccess("✅ User registered successfully");
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        }
    };

    if (user?.role !== "admin") return <p className="text-center mt-10">Access denied</p>;

    return (
        <div className="max-w-6xl mx-auto mt-10 px-4">
            <h2 className="text-2xl font-bold mb-6 text-center">🛠️ Admin Dashboard</h2>

            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded shadow mb-6"
            >
                <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={handleChange}
                    className="border px-3 py-2 rounded"
                    required
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    className="border px-3 py-2 rounded"
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    className="border px-3 py-2 rounded"
                    required
                />

                <input
                    type="text"
                    name="uniqueId"
                    placeholder="Enrollment No / Faculty ID"
                    value={form.uniqueId}
                    onChange={handleChange}
                    className="border px-3 py-2 rounded"
                    required
                />

                <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="border px-3 py-2 rounded"
                >
                    <option value="student">Student</option>
                    <option value="teacher">Faculty</option>
                </select>

                <select
                    name="class"
                    value={form.class}
                    onChange={handleChange}
                    className="border px-3 py-2 rounded"
                >
                    <option value="">Select Class</option>
                    {classes.map((cls) => (
                        <option key={cls._id} value={cls._id}>
                            {cls.name}
                        </option>
                    ))}
                </select>

                <button
                    type="submit"
                    className="col-span-1 md:col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    Register User
                </button>

                {success && <p className="col-span-2 text-green-600">{success}</p>}
                {error && <p className="col-span-2 text-red-600">{error}</p>}
            </form>

            <h3 className="font-semibold mb-2">📋 Registered Users</h3>
            <div className="overflow-x-auto bg-white rounded shadow">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="py-2 px-4 text-left">Name</th>
                            <th className="py-2 px-4 text-left">Email</th>
                            <th className="py-2 px-4 text-left">ID</th>
                            <th className="py-2 px-4 text-left">Role</th>
                            <th className="py-2 px-4 text-left">Class</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u._id}>
                                <td className="py-2 px-4">{u.name}</td>
                                <td className="py-2 px-4">{u.email}</td>
                                <td className="py-2 px-4">{u.uniqueId}</td>
                                <td className="py-2 px-4 capitalize">{u.role}</td>
                                <td className="py-2 px-4">{u.class?.name || "N/A"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;
