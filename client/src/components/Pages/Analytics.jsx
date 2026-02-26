import React from "react";

const Analytics = () => {
  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-semibold">Analytics</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
          📈 Monthly Completion Chart
        </div>

        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
          🔥 Streak Graph
        </div>

        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
          🧠 Category Performance
        </div>

        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
          📊 Success Rate %
        </div>

      </div>
    </div>
  );
};

export default Analytics;