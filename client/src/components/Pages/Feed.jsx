import React from "react";

const Feed = () => {
  return (
    <div className="space-y-6">

      {/* Create Post */}
      <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
        <textarea
          placeholder="Share your progress..."
          className="w-full bg-zinc-800 p-3 rounded-lg outline-none"
        />
        <button className="mt-3 bg-indigo-600 px-4 py-2 rounded-lg">
          Post
        </button>
      </div>

      {/* Post Card */}
      <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 space-y-3">
        <h3 className="font-semibold">Satish Sharma</h3>
        <p>Completed my workout streak 💪🔥</p>

        <div className="flex gap-4 text-sm text-zinc-400">
          <button>👍 Like</button>
          <button>💬 Comment</button>
        </div>
      </div>

    </div>
  );
};

export default Feed;