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
  const [feedback, setFeedback] = useState({ message: "", type: "" });

  const token = localStorage.getItem("token");
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await Promise.all([fetchClasses(), fetchUsers()]);
  };

  const fetchClasses = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE}/classes`, config);
      setClasses(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch classes", err);
      setFeedback({ message: "Failed to load class data", type: "error" });
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE}/users/all`, config);
      setUsers(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch users", err);
      setFeedback({ message: "Failed to load user data", type: "error" });
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ message: "", type: "" });

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE}/users/register`, form, config);

      setForm({
        name: "",
        email: "",
        password: "",
        uniqueId: "",
        role: "student",
        class: "",
      });

      await fetchUsers();

      setFeedback({ message: "✅ User registered successfully", type: "success" });
    } catch (err) {
      setFeedback({
        message: err.response?.data?.message || "Registration failed",
        type: "error",
      });
    }
  };

  if (user?.role !== "admin") {
    return <p className="text-center mt-10 text-red-500">🚫 Access denied</p>;
  }

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <h2 className="text-3xl font-semibold mb-8 text-center">🛠️ Admin Dashboard</h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-lg shadow mb-6"
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
          className="col-span-1 md:col-span-2 bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition duration-200"
        >
          Register User
        </button>

        {feedback.message && (
          <p
            className={`col-span-2 mt-2 ${
              feedback.type === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {feedback.message}
          </p>
        )}
      </form>

      <h3 className="text-xl font-semibold mb-3">📋 Registered Users</h3>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">ID</th>
              <th className="py-2 px-4">Role</th>
              <th className="py-2 px-4">Class</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((u) => (
                <tr key={u._id} className="border-t">
                  <td className="py-2 px-4">{u.name}</td>
                  <td className="py-2 px-4">{u.email}</td>
                  <td className="py-2 px-4">{u.uniqueId}</td>
                  <td className="py-2 px-4 capitalize">{u.role}</td>
                  <td className="py-2 px-4">{u.class?.name || "N/A"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-4 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
