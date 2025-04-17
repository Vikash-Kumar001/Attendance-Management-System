// import { useEffect, useState } from "react";
// import axios from "axios";

// const ProfilePage = () => {
//   const [user, setUser] = useState(null);
//   const [error, setError] = useState("");

//   const fetchProfile = async () => {
//     try {
//       const { data } = await axios.get(
//         `${import.meta.env.VITE_API_BASE}/users/profile`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       setUser(data);
//     } catch (err) {
//       setError("Failed to fetch profile.");
//     }
//   };

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   if (error) return <p className="text-center text-red-500">{error}</p>;
//   if (!user) return <p className="text-center">Loading profile...</p>;

//   return (
//     <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded shadow">
//       <h2 className="text-xl font-bold mb-4 text-center">👤 Profile</h2>
//       <p><strong>Name:</strong> {user.name}</p>
//       <p><strong>Email:</strong> {user.email}</p>
//       <p><strong>ID:</strong> {user.uniqueId}</p>
//       <p><strong>Role:</strong> {user.role}</p>
//       <p><strong>Class:</strong> {user.class?.name || "N/A"}</p>
//     </div>
//   );
// };

// export default ProfilePage;


import { useEffect, useState } from "react";
import axios from "axios";
import {
  UserCircleIcon,
  MailIcon,
  UserIcon,
  UserCheck2,
  GraduationCap,
  BadgeInfo,
} from "lucide-react"; // ✅ Add BadgeInfo here
import { motion } from "framer-motion";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
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

    fetchProfile();
  }, []);

  if (error) {
    return <p className="text-center text-red-600 mt-10">{error}</p>;
  }

  if (!user) {
    return <p className="text-center text-gray-500 mt-10">Loading profile...</p>;
  }

  const profileImage = user.profileImage || "/default-avatar.png"; // fallback if image not uploaded

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-6">
          <img
            src={profileImage}
            alt="Profile"
            className="h-24 w-24 rounded-full object-cover border-2 border-blue-600 shadow"
          />
          <h2 className="text-2xl font-bold text-gray-800 mt-4">{user.name}</h2>
          <span className="text-sm text-gray-500 capitalize">{user.role}</span>
        </div>

        <div className="space-y-4 text-gray-700 text-sm">
          <ProfileItem icon={<MailIcon className="h-5 w-5" />} label="Email" value={user.email} />
          <ProfileItem icon={<BadgeInfo className="h-5 w-5" />} label="Unique ID" value={user.uniqueId} />
          <ProfileItem icon={<UserCheck2 className="h-5 w-5" />} label="Role" value={user.role} />
          <ProfileItem icon={<GraduationCap className="h-5 w-5" />} label="Class" value={user.class?.name || "N/A"} />
        </div>
      </motion.div>
    </div>
  );
};

const ProfileItem = ({ icon, label, value }) => (
  <div className="flex items-center space-x-3">
    <div className="text-blue-600">{icon}</div>
    <div className="flex flex-col">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="font-medium text-gray-800">{value}</span>
    </div>
  </div>
);

export default ProfilePage;
