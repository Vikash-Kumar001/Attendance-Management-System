import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Pencil, Trash2 } from "lucide-react";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    uniqueId: "",
    role: "student",
    class: "",
    department: ""
  });

  const [showDepartment, setShowDepartment] = useState(false);
  const [classes, setClasses] = useState([]);
  const [users, setUsers] = useState([]);
  const [feedback, setFeedback] = useState({ message: "", type: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUserId, setEditingUserId] = useState(null);

  const token = localStorage.getItem("token");
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const departments = [
    "Computer Science",
    "Information Technology",
    "Electronics",
    "Mechanical",
    "Civil",
  ];

  const techClasses = [
    "B.Tech - Semester 1",
    "B.Tech - Semester 2",
    "B.Tech - Semester 3",
    "B.Tech - Semester 4",
    "B.Tech - Semester 5",
    "B.Tech - Semester 6",
    "B.Tech - Semester 7",
    "B.Tech - Semester 8",
    "BCA - Semester 1",
    "BCA - Semester 2",
    "BCA - Semester 3",
    "BCA - Semester 4",
    "BCA - Semester 5",
    "BCA - Semester 6",
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE}/users`, config);
      setUsers(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch users", err);
      setFeedback({ message: "Failed to load user data", type: "error" });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "role") {
      setShowDepartment(value === "teacher");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ message: "", type: "" });

    try {
      if (editingUserId) {
        await axios.put(`${import.meta.env.VITE_API_BASE}/users/${editingUserId}`, form, config);
        setFeedback({ message: "✅ User updated successfully", type: "success" });
        setEditingUserId(null);
      } else {
        await axios.post(`${import.meta.env.VITE_API_BASE}/users`, form, config);
        setFeedback({ message: "✅ User registered successfully", type: "success" });
      }

      setForm({
        name: "",
        email: "",
        password: "",
        uniqueId: "",
        role: "student",
        class: "",
        department: ""
      });

      fetchUsers();
    } catch (err) {
      setFeedback({
        message: err.response?.data?.message || "Operation failed",
        type: "error",
      });
    }
  };

  const handleEdit = (user) => {
    setForm({
      name: user.name,
      email: user.email,
      password: "",
      uniqueId: user.uniqueId,
      role: user.role,
      class: user.class?._id || "",
      department: user.department || "",
    });
    setShowDepartment(user.role === "teacher");
    setEditingUserId(user._id);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE}/users/${id}`, config);
      fetchUsers();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase();
    return (
      u.name.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      u.uniqueId.toLowerCase().includes(term)
    );
  });

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
          required={!editingUserId}
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
          {techClasses.map((cls) => (
            <option key={cls} value={cls}>{cls}</option>
          ))}
        </select>

        {showDepartment && (
          <select
            name="department"
            value={form.department}
            onChange={handleChange}
            className="border px-3 py-2 rounded md:col-span-2"
          >
            <option value="">Select Department</option>
            {departments.map((dep) => (
              <option key={dep} value={dep}>{dep}</option>
            ))}
          </select>
        )}

        <button
          type="submit"
          className="col-span-1 md:col-span-2 bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition duration-200"
        >
          {editingUserId ? "Update User" : "Register User"}
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

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

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
              <th className="py-2 px-4">Department</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((u) => (
                <tr key={u._id} className="border-t">
                  <td className="py-2 px-4">{u.name}</td>
                  <td className="py-2 px-4">{u.email}</td>
                  <td className="py-2 px-4">{u.uniqueId}</td>
                  <td className="py-2 px-4 capitalize">{u.role}</td>
                  <td className="py-2 px-4">{u.class?.name || u.class || "N/A"}</td>
                  <td className="py-2 px-4">{u.department || "-"}</td>
                  <td className="py-2 px-4 space-x-2">
                    <button onClick={() => handleEdit(u)} className="text-blue-600">
                      <Pencil className="inline h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(u._id)} className="text-red-600">
                      <Trash2 className="inline h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-4 text-center text-gray-500">
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
