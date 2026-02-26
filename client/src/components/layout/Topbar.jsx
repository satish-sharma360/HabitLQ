import React, { useContext } from "react";
import { AuthContext } from "../../context/auth";

const Topbar = () => {
  const { user } = useContext(AuthContext);

  const xpPercent = Math.min((user?.xp / 1000) * 100, 100);

  return (
    <div className="h-16 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-6">

      <h1 className="text-sm text-zinc-400">
        Welcome, <span className="text-white font-medium">{user?.name}</span> 👋
      </h1>

      <div className="flex items-center gap-6">

        {/* XP Bar */}
        <div className="w-40">
          <p className="text-xs text-zinc-400">Level {user?.level}</p>
          <div className="w-full h-2 bg-zinc-800 rounded-full mt-1">
            <div
              className="h-2 bg-indigo-500 rounded-full"
              style={{ width: `${xpPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center font-semibold">
          {user?.name?.charAt(0)}
        </div>

      </div>
    </div>
  );
};

export default Topbar;