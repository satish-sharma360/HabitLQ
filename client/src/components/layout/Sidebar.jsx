import React, { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../context/auth";

const Sidebar = () => {
  const { user, logOut } = useContext(AuthContext);
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: "🏠" },
    { name: "My Habits", path: "/habits", icon: "✅" },
    { name: "Gamification", path: "/gamification", icon: "🏆" },
    { name: "Analytics", path: "/analytics", icon: "📊" },
    { name: "AI Coach", path: "/ai", icon: "🤖" },
    { name: "Social Feed", path: "/feed", icon: "🌍" },
    { name: "Profile", path: "/profile", icon: "⚙" },
  ];

  if (user?.role === "admin") {
    navItems.push({
      name: "Admin Panel",
      path: "/admin",
      icon: "🛡",
    });
  }

  return (
    <aside
      className={`${
        collapsed ? "w-20" : "w-64"
      } bg-zinc-900 border-r border-zinc-800 h-screen p-4 transition-all duration-300 hidden md:flex flex-col`}
    >
      {/* Top Section */}
      <div className="flex items-center justify-between mb-8">
        {!collapsed && (
          <h2 className="text-xl font-bold">HabitIQ</h2>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-zinc-400 hover:text-white"
        >
          {collapsed ? "➡" : "⬅"}
        </button>
      </div>

      {/* Navigation */}
      <nav className="space-y-2 flex-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition
              ${
                isActive
                  ? "bg-indigo-600 text-white"
                  : "hover:bg-zinc-800 text-zinc-300"
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            {!collapsed && <span>{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <button
        onClick={logOut}
        className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-red-600/20 text-red-400 text-sm"
      >
        <span className="text-lg">🚪</span>
        {!collapsed && <span>Logout</span>}
      </button>
    </aside>
  );
};

export default Sidebar;