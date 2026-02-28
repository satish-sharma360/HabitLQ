import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";

/* ── tiny helpers ─────────────────────────────────────────────────── */
const Loader = () => (
  <div className="flex justify-center items-center py-20">
    <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

const rankMedal = (i) => {
  if (i === 0) return "🥇";
  if (i === 1) return "🥈";
  if (i === 2) return "🥉";
  return `#${i + 1}`;
};

/* ── XP progress bar ──────────────────────────────────────────────── */
const XPBar = ({ xp, level }) => {
  const xpPerLevel = 100;
  const xpIntoLevel = xp % xpPerLevel;
  const pct = Math.round((xpIntoLevel / xpPerLevel) * 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-zinc-400">
        <span>{xpIntoLevel} / {xpPerLevel} XP to Level {level + 1}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-linear-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

/* ── tabs ─────────────────────────────────────────────────────────── */
const TABS = ["Overview", "Badges", "Leaderboard"];

/* ══════════════════════════════════════════════════════════════════ */
const Gamification = () => {
  const [activeTab, setActiveTab] = useState("Overview");
  const [profile, setProfile] = useState(null);
  const [badges, setBadges] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* fetch all three endpoints in parallel */
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [profileRes, badgesRes, leaderboardRes] = await Promise.all([
          axiosInstance.get("/gamification/profile"),
          axiosInstance.get("/gamification/badges"),
          axiosInstance.get("/gamification/leaderboard"),
        ]);
        setProfile(profileRes.data.data);
        setBadges(badgesRes.data.data);
        setLeaderboard(leaderboardRes.data.data);
      } catch (err) {
        console.error("Error fetching gamification data", err);
        setError("Failed to load gamification data.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return <Loader />;
  if (error) return <p className="text-red-400 text-center py-20">{error}</p>;

  /* find my rank in leaderboard */
  const myRank = leaderboard.findIndex((u) => u._id === profile?._id);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">

      {/* ── page header ── */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Progress & Rewards</h1>
        <p className="text-sm text-zinc-400 mt-0.5">Track your XP, badges, and rank</p>
      </div>

      {/* ── tabs ── */}
      <div className="flex gap-1 bg-zinc-900 border border-zinc-800 rounded-xl p-1 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab
                ? "bg-indigo-600 text-white"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ════════════════════════════════════════════════════════════ */}
      {/* OVERVIEW TAB                                                */}
      {/* ════════════════════════════════════════════════════════════ */}
      {activeTab === "Overview" && profile && (
        <div className="space-y-4">

          {/* profile card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5">
            {/* avatar + name */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-2xl font-bold select-none">
                {profile.name?.[0]?.toUpperCase() ?? "?"}
              </div>
              <div>
                <h2 className="text-xl font-semibold">{profile.name}</h2>
                <p className="text-sm text-zinc-400">
                  {myRank >= 0 ? `Rank #${myRank + 1} on leaderboard` : "Unranked"}
                </p>
              </div>
            </div>

            {/* stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Level", value: profile.level, icon: "⚡" },
                { label: "Total XP", value: profile.xp, icon: "✨" },
                { label: "Streak", value: `${profile.streak ?? 0}d`, icon: "🔥" },
                { label: "Badges", value: profile.badges?.length ?? 0, icon: "🏅" },
              ].map(({ label, value, icon }) => (
                <div key={label} className="bg-zinc-800 rounded-xl p-3 text-center">
                  <p className="text-xl font-bold">{icon} {value}</p>
                  <p className="text-xs text-zinc-400 mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* XP progress */}
            <XPBar xp={profile.xp} level={profile.level} />
          </div>

          {/* recent badges preview */}
          {badges.filter((b) => b.unlocked).length > 0 && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-sm">Recent Badges</h3>
                <button
                  onClick={() => setActiveTab("Badges")}
                  className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  View all →
                </button>
              </div>
              <div className="flex gap-3 flex-wrap">
                {badges
                  .filter((b) => b.unlocked)
                  .slice(0, 5)
                  .map((b) => (
                    <div
                      key={b._id}
                      title={b.description}
                      className="flex flex-col items-center gap-1 bg-zinc-800 rounded-xl px-3 py-2 text-center"
                    >
                      <span className="text-2xl">{b.icon ?? "🏅"}</span>
                      <span className="text-xs text-zinc-300 max-w-16 leading-tight">{b.name}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════ */}
      {/* BADGES TAB                                                  */}
      {/* ════════════════════════════════════════════════════════════ */}
      {activeTab === "Badges" && (
        <div className="space-y-3">
          <p className="text-sm text-zinc-400">
            {badges.filter((b) => b.unlocked).length} / {badges.length} unlocked
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {badges.map((badge) => (
              <div
                key={badge._id}
                className={`relative rounded-xl p-4 border text-center transition-all ${
                  badge.unlocked
                    ? "bg-zinc-900 border-indigo-500/40 shadow-lg shadow-indigo-900/20"
                    : "bg-zinc-900/50 border-zinc-800 opacity-50"
                }`}
              >
                {/* lock overlay */}
                {!badge.unlocked && (
                  <div className="absolute top-2 right-2 text-zinc-500 text-xs">🔒</div>
                )}

                <div className="text-3xl mb-2">{badge.icon ?? "🏅"}</div>
                <p className="text-sm font-medium leading-tight">{badge.name}</p>
                {badge.description && (
                  <p className="text-xs text-zinc-500 mt-1 leading-tight">{badge.description}</p>
                )}
                {badge.unlocked && (
                  <span className="inline-block mt-2 text-xs bg-indigo-600/30 text-indigo-300 px-2 py-0.5 rounded-full">
                    Earned
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════ */}
      {/* LEADERBOARD TAB                                             */}
      {/* ════════════════════════════════════════════════════════════ */}
      {activeTab === "Leaderboard" && (
        <div className="space-y-2">
          {leaderboard.map((user, i) => {
            const isMe = user._id === profile?._id;
            return (
              <div
                key={user._id}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl border transition-colors ${
                  isMe
                    ? "bg-indigo-600/10 border-indigo-500/40"
                    : "bg-zinc-900 border-zinc-800"
                }`}
              >
                {/* rank */}
                <span className="w-8 text-center text-lg font-bold shrink-0">
                  {rankMedal(i)}
                </span>

                {/* avatar */}
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                    isMe
                      ? "bg-linear-to-br from-indigo-500 to-violet-600"
                      : "bg-zinc-700"
                  }`}
                >
                  {user.name?.[0]?.toUpperCase() ?? "?"}
                </div>

                {/* name */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    {user.name} {isMe && <span className="text-indigo-400">(you)</span>}
                  </p>
                  <p className="text-xs text-zinc-400">Level {user.level}</p>
                </div>

                {/* xp */}
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold">{user.xp} XP</p>
                </div>
              </div>
            );
          })}

          {/* if user is not in top 10 */}
          {myRank === -1 && (
            <p className="text-center text-xs text-zinc-500 pt-2">
              You're not in the top 10 yet — keep completing habits to climb the ranks!
            </p>
          )}
        </div>
      )}

    </div>
  );
};

export default Gamification;