import React from "react";

const Dashboard = () => {
  return (
    <div className="grid lg:grid-cols-3 gap-6">

      {/* Left 2 Columns */}
      <div className="lg:col-span-2 space-y-6">

        {/* Today's Habits */}
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
          <h2 className="text-lg font-semibold mb-4">Today’s Habits</h2>

          <div className="space-y-3">
            <div className="flex justify-between items-center bg-zinc-800 p-3 rounded-lg">
              <span>Morning Workout</span>
              <input type="checkbox" />
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <p className="text-zinc-400 text-sm">No recent activity.</p>
        </div>

      </div>

      {/* Right Column */}
      <div className="space-y-6">

        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
          <h2 className="text-lg font-semibold mb-4">🔥 Streak Summary</h2>
          <p className="text-zinc-400 text-sm">
            You’re on a 5-day streak. Keep pushing!
          </p>
        </div>

        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
          <h2 className="text-lg font-semibold mb-4">🤖 AI Motivation</h2>
          <p className="text-zinc-400 text-sm">
            “Small daily improvements lead to massive long-term growth.”
          </p>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;