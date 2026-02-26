import React from "react";

const Habits = () => {
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">My Habits</h1>
        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm">
          ➕ Create Habit
        </button>
      </div>

      {/* Habit Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800 space-y-3">
          <h2 className="font-semibold">Morning Workout</h2>
          <p className="text-sm text-zinc-400">Category: Health</p>
          <p className="text-sm">🔥 Streak: 5 days</p>
          <p className="text-sm">⭐ XP Earned: 150</p>
          <p className="text-sm text-zinc-400">⏰ 7:00 AM</p>

          <div className="flex gap-2 mt-3">
            <button className="flex-1 bg-green-600 hover:bg-green-700 py-1 rounded text-sm">
              Complete
            </button>
            <button className="bg-yellow-600 hover:bg-yellow-700 px-3 rounded text-sm">
              Edit
            </button>
            <button className="bg-red-600 hover:bg-red-700 px-3 rounded text-sm">
              Delete
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Habits;