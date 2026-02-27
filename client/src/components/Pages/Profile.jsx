import axios from "axios";
import React from "react";
import { useState } from "react";
import axiosInstance from "../../api/axios";

const Profile = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/auth/update-profile", formData);
    } catch (error) {
      alert("Error in Update Profile");
      console.log("Error in Profile", error);
    }
  };

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-semibold">Profile</h1>

      <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 space-y-4">
        <form onSubmit={handleUpdateProfile}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Update Name"
            className="w-full bg-zinc-800 p-3 rounded-lg mb-3"
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Change Email"
            className="w-full bg-zinc-800 p-3 rounded-lg mb-3"
          />
        <button
          type="submit"
          className="bg-indigo-600 px-4 py-2 rounded-lg"
          >
          Update Profile
        </button>
          </form>
      </div>
    </div>
  );
};

export default Profile;
