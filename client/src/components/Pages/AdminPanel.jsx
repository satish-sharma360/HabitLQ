import React from "react";

const AdminPanel = () => {
  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-semibold">Admin Panel</h1>

      <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
        <h2 className="font-semibold mb-3">Manage Users</h2>
        <p className="text-sm text-zinc-400">User table here...</p>
      </div>

      <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
        <h2 className="font-semibold mb-3">Manage Posts</h2>
        <p className="text-sm text-zinc-400">Post moderation here...</p>
      </div>

    </div>
  );
};

export default AdminPanel;