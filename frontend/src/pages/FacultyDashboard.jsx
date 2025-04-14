import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const FacultyDashboard = () => {
    const { user } = useAuth();
    const [students, setStudents] = useState([]);
    const [statusMap, setStatusMap] = useState({});
    const [date, setDate] = useState("");
    const [message, setMessage] = useState("");
    const [leaves, setLeaves] = useState([]);

    useEffect(() => {
        if (user?.role === "teacher" && user.class) {
            fetchStudents();
            fetchLeaves();
        }
    }, [user]);

    const fetchStudents = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_API_BASE}/users/class/${user.class}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            setStudents(res.data);
        } catch (error) {
            console.error("Failed to fetch students", error);
        }
    };

    const fetchLeaves = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_API_BASE}/leaves/all`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            setLeaves(res.data);
        } catch (error) {
            console.error("Error fetching leaves:", error);
        }
    };

    const handleStatusChange = (studentId, status) => {
        setStatusMap({ ...statusMap, [studentId]: status });
    };

    const handleSubmit = async () => {
        if (!date) return alert("Please select a date");

        try {
            for (const student of students) {
                const status = statusMap[student._id];
                if (!status) continue;

                await axios.post(
                    `${import.meta.env.VITE_API_BASE}/attendance/mark`,
                    {
                        studentId: student._id,
                        date,
                        status,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
            }

            setMessage("✅ Attendance submitted successfully.");
            setStatusMap({});
        } catch (error) {
            console.error("Attendance marking error:", error);
        }
    };

    const handleLeaveAction = async (leaveId, status) => {
        try {
            await axios.put(
                `${import.meta.env.VITE_API_BASE}/leaves/update/${leaveId}`,
                { status },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            fetchLeaves();
        } catch (error) {
            console.error("Leave status update failed:", error);
        }
    };

    if (user?.role !== "teacher")
        return <p className="text-center mt-10">Access denied</p>;

    return (
        <div className="max-w-5xl mx-auto mt-10 px-4">
            <h2 className="text-2xl font-bold mb-4 text-center">
                👨‍🏫 Faculty Dashboard
            </h2>

            <div className="mb-4">
                <label className="block mb-1 font-medium">Select Date</label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="border px-3 py-2 rounded w-full max-w-xs"
                />
            </div>

            <table className="w-full border text-sm bg-white rounded shadow mb-6">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="py-2 px-3 border">Name</th>
                        <th className="py-2 px-3 border">Enrollment No</th>
                        <th className="py-2 px-3 border">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((stu) => (
                        <tr key={stu._id}>
                            <td className="py-2 px-3 border">{stu.name}</td>
                            <td className="py-2 px-3 border">{stu.enrollmentNo}</td>
                            <td className="py-2 px-3 border">
                                <select
                                    value={statusMap[stu._id] || ""}
                                    onChange={(e) =>
                                        handleStatusChange(stu._id, e.target.value)
                                    }
                                    className="border rounded px-2 py-1"
                                >
                                    <option value="">Select</option>
                                    <option value="Present">Present</option>
                                    <option value="Absent">Absent</option>
                                    <option value="Leave">Leave</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button
                onClick={handleSubmit}
                className="mb-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
                Submit Attendance
            </button>

            {message && <p className="text-green-600">{message}</p>}

            <h3 className="text-xl font-semibold mb-3">📩 Leave Applications</h3>
            <ul className="bg-white rounded shadow p-4 text-sm space-y-4 max-h-[300px] overflow-y-auto">
                {leaves.map((leave) => (
                    <li key={leave._id} className="border-b pb-2">
                        <div className="font-medium">
                            {leave.student.name} – {leave.reason}
                        </div>
                        <div className="text-gray-600 text-xs">
                            {new Date(leave.fromDate).toLocaleDateString()} →{" "}
                            {new Date(leave.toDate).toLocaleDateString()}
                        </div>
                        <div className="mt-1 flex gap-2 items-center">
                            <button
                                onClick={() => handleLeaveAction(leave._id, "Approved")}
                                className="bg-green-500 text-white px-2 py-1 rounded text-xs"
                            >
                                Approve
                            </button>
                            <button
                                onClick={() => handleLeaveAction(leave._id, "Rejected")}
                                className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                            >
                                Reject
                            </button>
                            <span className="ml-auto text-xs font-semibold">
                                Status:{" "}
                                <span
                                    className={`px-2 py-1 rounded ${leave.status === "Approved"
                                            ? "bg-green-100 text-green-700"
                                            : leave.status === "Rejected"
                                                ? "bg-red-100 text-red-700"
                                                : "bg-yellow-100 text-yellow-700"
                                        }`}
                                >
                                    {leave.status}
                                </span>
                            </span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FacultyDashboard;
