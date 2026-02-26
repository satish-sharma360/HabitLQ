import React from "react";

const Gamification = () => {
  return (
    <div className="space-y-8">

      {/* Profile Card */}
      <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
        <h2 className="text-lg font-semibold mb-3">Profile Overview</h2>
        <p>Level: 5</p>
        <p>Total XP: 1200</p>
        <p>Total Streak: 30 days</p>
        <p>Rank: #12</p>
      </div>

      {/* Badges */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Badges</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-800 text-center">
            🏅 First 7 Days
          </div>
          <div className="bg-zinc-800 p-4 rounded-lg text-center opacity-50">
            🔒 30 Day Warrior
          </div>
        </div>
      </div>

    </div>
  );
};

export default Gamification;