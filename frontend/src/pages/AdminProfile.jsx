import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "admin") {
      navigate("/login"); // Not logged in or not an admin
    } else {
      setAdmin(user);
    }
  }, [navigate]);

  if (!admin) return null;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-4">Admin Profile</h2>
      <p><strong>Name:</strong> {admin.name}</p>
      <p><strong>Email:</strong> {admin.email}</p>
      <p><strong>Role:</strong> {admin.role}</p>
      <p className="text-gray-600 mt-4">Welcome to the admin dashboard! Here you can manage users, products, and orders.</p>
    </div>
  );
};

export default AdminProfile;
