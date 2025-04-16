import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ useNavigate for React Router v6+
import { useAuth } from "../context/AuthContext"; // ✅ Get setUser from context

const LoginPage = () => {
  const [form, setForm] = useState({ uniqueId: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // ✅ Modern alternative to useHistory
  const { setUser } = useAuth(); // ✅ So user is set immediately after login

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_BASE}/users/login`,
        form
      );

      localStorage.setItem("token", data.token);
      setUser(data); // ✅ Instantly set user in AuthContext

      // Role-based redirection
      if (data.role === "admin") {
        navigate("/register");
      } else if (data.role === "student") {
        navigate("/student");
      } else if (data.role === "teacher") {
        navigate("/faculty");
      } else {
        navigate("/profile");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 py-6 w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <input
          type="text"
          name="uniqueId"
          placeholder="Admin ID / Faculty ID / Enrollment No"
          value={form.uniqueId}
          onChange={handleChange}
          className="mb-4 w-full px-4 py-2 border rounded"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="mb-4 w-full px-4 py-2 border rounded"
          required
        />

        {error && <p className="text-red-500 mb-3 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
