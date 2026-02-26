import React from "react";

const Profile = () => {
  return (
    <div className="max-w-xl space-y-6">

      <h1 className="text-2xl font-semibold">Profile</h1>

      <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 space-y-4">
        <input
          type="text"
          placeholder="Update Name"
          className="w-full bg-zinc-800 p-3 rounded-lg"
        />

        <input
          type="password"
          placeholder="Change Password"
          className="w-full bg-zinc-800 p-3 rounded-lg"
        />

        <button className="bg-indigo-600 px-4 py-2 rounded-lg">
          Update Profile
        </button>
      </div>

    </div>
  );
};

export default Profile;