import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const StudentDashboard = () => {
    const { user } = useAuth();
    const [attendance, setAttendance] = useState([]);
    const [leaves, setLeaves] = useState([]);
    const [form, setForm] = useState({ reason: "", fromDate: "", toDate: "" });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const fetchAttendance = async () => {
        try {
            const { data } = await axios.get(
                `${import.meta.env.VITE_API_BASE}/attendance/my`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            setAttendance(data);
        } catch (err) {
            console.error("Attendance fetch error:", err);
        }
    };

    const fetchLeaves = async () => {
        try {
            const { data } = await axios.get(
                `${import.meta.env.VITE_API_BASE}/leaves/my`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            setLeaves(data);
        } catch (err) {
            console.error("Leave fetch error:", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);
        try {
            await axios.post(
                `${import.meta.env.VITE_API_BASE}/leaves/apply`,
                form,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            setForm({ reason: "", fromDate: "", toDate: "" });
            fetchLeaves();
            setSuccess("✅ Leave applied successfully");
        } catch (err) {
            setError("Failed to apply leave");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        if (!confirm("Are you sure you want to cancel this leave?")) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_BASE}/leaves/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            fetchLeaves();
        } catch (err) {
            console.error("Cancel leave error:", err);
        }
    };

    useEffect(() => {
        if (user?.role === "student") {
            fetchAttendance();
            fetchLeaves();
        }
    }, [user]);

    if (user?.role !== "student")
        return <p className="text-center mt-10">Access denied</p>;

    return (
        <div className="max-w-4xl mx-auto mt-8 px-4">
            <h2 className="text-2xl font-bold mb-6 text-center">🎓 Student Dashboard</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Attendance Section */}
                <div>
                    <h3 className="font-semibold mb-2">Your Attendance</h3>
                    <ul className="bg-white p-4 rounded shadow text-sm max-h-[300px] overflow-y-auto">
                        {attendance.map((a) => (
                            <li
                                key={a._id}
                                className="border-b py-2 flex justify-between"
                            >
                                <span>{new Date(a.date).toLocaleDateString()}</span>
                                <span
                                    className={`font-medium px-2 py-1 rounded text-xs ${a.status === "Present"
                                            ? "bg-green-100 text-green-700"
                                            : a.status === "Leave"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-red-100 text-red-700"
                                        }`}
                                >
                                    {a.status}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Leave Section */}
                <div>
                    <h3 className="font-semibold mb-2">Apply for Leave</h3>
                    <form
                        onSubmit={handleSubmit}
                        className="bg-white p-4 rounded shadow space-y-3 text-sm"
                    >
                        <input
                            type="text"
                            name="reason"
                            value={form.reason}
                            onChange={(e) =>
                                setForm({ ...form, reason: e.target.value })
                            }
                            placeholder="Reason"
                            className="w-full border px-3 py-2 rounded"
                            required
                        />
                        <input
                            type="date"
                            name="fromDate"
                            value={form.fromDate}
                            onChange={(e) =>
                                setForm({ ...form, fromDate: e.target.value })
                            }
                            className="w-full border px-3 py-2 rounded"
                            required
                        />
                        <input
                            type="date"
                            name="toDate"
                            value={form.toDate}
                            onChange={(e) =>
                                setForm({ ...form, toDate: e.target.value })
                            }
                            className="w-full border px-3 py-2 rounded"
                            required
                        />
                        {error && <p className="text-red-600 text-sm">{error}</p>}
                        {success && (
                            <p className="text-green-600 text-sm">{success}</p>
                        )}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                        >
                            {loading ? "Submitting..." : "Apply Leave"}
                        </button>
                    </form>

                    <h3 className="mt-6 font-semibold">Leave History</h3>
                    <ul className="bg-white p-4 mt-2 rounded shadow text-sm max-h-[200px] overflow-y-auto">
                        {leaves.map((l) => (
                            <li key={l._id} className="border-b py-2">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <strong>{l.reason}</strong>{" "}
                                        <span className="text-gray-600 text-sm block">
                                            {new Date(l.fromDate).toLocaleDateString()} →{" "}
                                            {new Date(l.toDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`text-xs px-2 py-1 rounded ${l.status === "Approved"
                                                    ? "bg-green-100 text-green-700"
                                                    : l.status === "Rejected"
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-yellow-100 text-yellow-700"
                                                }`}
                                        >
                                            {l.status}
                                        </span>
                                        {l.status === "Pending" && (
                                            <button
                                                onClick={() => handleCancel(l._id)}
                                                className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
