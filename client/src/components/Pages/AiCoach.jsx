import React from "react";

const AiCoach = () => {
  return (
    <div className="grid lg:grid-cols-3 gap-6">

      {/* Main Chat */}
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
          <input
            type="text"
            placeholder="Ask your AI Coach..."
            className="w-full bg-zinc-800 p-3 rounded-lg outline-none"
          />
          <button className="mt-3 bg-indigo-600 px-4 py-2 rounded-lg">
            Ask Coach
          </button>
        </div>

        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
          🤖 AI Response will appear here...
        </div>
      </div>

      {/* History */}
      <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
        <h2 className="font-semibold mb-3">History</h2>
        <p className="text-sm text-zinc-400">No past questions.</p>
      </div>

    </div>
  );
};

export default AiCoach;