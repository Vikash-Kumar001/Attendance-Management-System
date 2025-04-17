import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { DownloadIcon, SearchIcon, Trash2, Pencil } from "lucide-react";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    uniqueId: "",
    role: "student",
    class: "",
    department: "",
  });

  const [classes, setClasses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [feedback, setFeedback] = useState({ message: "", type: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [analytics, setAnalytics] = useState({ totalUsers: 0, totalStudents: 0, totalTeachers: 0 });

  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchUsers();
    fetchClasses();
    fetchDepartments();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE}/users/all`, config);
      setUsers(res.data);
      updateAnalytics(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch users", err);
      setFeedback({ message: "Failed to load user data", type: "error" });
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE}/classes`, config);
      setClasses(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch classes", err);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE}/departments`, config);
      setDepartments(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch departments", err);
    }
  };

  const updateAnalytics = (users) => {
    const totalUsers = users.length;
    const totalStudents = users.filter(u => u.role === 'student').length;
    const totalTeachers = users.filter(u => u.role === 'teacher').length;

    setAnalytics({ totalUsers, totalStudents, totalTeachers });
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
        department: "",
      });

      await fetchUsers();
      setFeedback({ message: "✅ User registered successfully", type: "success" });
    } catch (err) {
      setFeedback({ message: err.response?.data?.message || "Registration failed", type: "error" });
    }
  };

  const handleDelete = async (userId) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_BASE}/users/${userId}`, config);
        await fetchUsers();
      } catch (err) {
        alert("Failed to delete user");
      }
    }
  };

  const handleEdit = (user) => {
    setCurrentUser(user);
    setForm({
      name: user.name,
      email: user.email,
      password: "",
      uniqueId: user.uniqueId,
      role: user.role,
      class: user.class?._id,
      department: user.department || "",
    });
    setIsModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${import.meta.env.VITE_API_BASE}/users/${currentUser._id}`, form, config);
      setIsModalOpen(false);
      await fetchUsers();
      setFeedback({ message: "✅ User updated successfully", type: "success" });
    } catch (err) {
      setFeedback({ message: "❌ Failed to update user", type: "error" });
    }
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.class?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportCSV = () => {
    const csvRows = ["Name,Email,ID,Role,Class,Department"];
    users.forEach((u) => {
      csvRows.push(`"${u.name}","${u.email}","${u.uniqueId}","${u.role}","${u.class?.name || ''}","${u.department || ''}"`);
    });
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users.csv";
    a.click();
  };

  if (user?.role !== "admin") {
    return <p className="text-center mt-10 text-red-500">🚫 Access denied</p>;
  }

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <h2 className="text-3xl font-semibold mb-8 text-center">🛠️ Admin Dashboard</h2>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-xl font-semibold mb-3">📊 Dashboard Analytics</h3>
        <p>Total Users: {analytics.totalUsers}</p>
        <p>Total Students: {analytics.totalStudents}</p>
        <p>Total Teachers: {analytics.totalTeachers}</p>
      </div>

      {/* User Registration Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-lg shadow mb-6">
        {/* Form Inputs */}
      </form>

      {/* Search & Export CSV */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by name, class, department..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded w-1/2"
        />
        <button onClick={exportCSV} className="flex items-center gap-1 bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700">
          <DownloadIcon className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* User List Table */}
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
                  <td className="py-2 px-4">{u.class?.name || "N/A"}</td>
                  <td className="py-2 px-4">{u.department || "-"}</td>
                  <td className="py-2 px-4">
                    <button onClick={() => handleEdit(u)} className="text-blue-600 hover:underline mr-3">
                      <Pencil className="inline w-4 h-4" /> Edit
                    </button>
                    <button onClick={() => handleDelete(u._id)} className="text-red-600 hover:underline">
                      <Trash2 className="inline w-4 h-4" /> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-4 text-center text-gray-500">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-xl font-semibold mb-4">Edit User</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              {/* Form for updating user details */}
              <input type="text" name="name" value={form.name} onChange={handleChange} className="border px-3 py-2 rounded w-full" required />
              <input type="email" name="email" value={form.email} onChange={handleChange} className="border px-3 py-2 rounded w-full" required />
              <input type="password" name="password" value={form.password} onChange={handleChange} className="border px-3 py-2 rounded w-full" />
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Update User</button>
            </form>
            <button onClick={() => setIsModalOpen(false)} className="mt-3 text-red-600">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
