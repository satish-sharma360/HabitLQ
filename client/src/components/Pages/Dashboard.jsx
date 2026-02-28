import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";

/* ── helpers ──────────────────────────────────────────────────────── */
const Spinner = () => (
  <div className="flex justify-center py-8">
    <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

const greet = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

const XPBar = ({ xp, level }) => {
  const xpPerLevel = 100;
  const pct = Math.round(((xp % xpPerLevel) / xpPerLevel) * 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-zinc-400">
        <span>{xp % xpPerLevel} / {xpPerLevel} XP</span>
        <span>{pct}%</span>
      </div>
      <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-linear-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

const MOTIVATIONAL_QUOTES = [
  "Small daily improvements lead to massive long-term growth.",
  "You don't rise to the level of your goals, you fall to the level of your systems.",
  "Every action you take is a vote for the person you want to become.",
  "The secret of getting ahead is getting started.",
  "Discipline is choosing between what you want now and what you want most.",
  "It's not about being perfect. It's about showing up.",
];

/* ── Today's habit row ────────────────────────────────────────────── */
// `done` and `onComplete` are now controlled from Dashboard so the
// progress ring reacts instantly when a habit is checked off.
const HabitRow = ({ habit, done, onComplete }) => {
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    if (done || loading) return;
    setLoading(true);
    await onComplete(habit._id);
    setLoading(false);
  };

  return (
    <div
      className={`flex justify-between items-center p-3 rounded-xl border transition-all duration-300 ${
        done
          ? "bg-green-900/20 border-green-800/40"
          : "bg-zinc-800 border-zinc-700 hover:border-zinc-600"
      }`}
    >
      <div className="flex items-center gap-3">
        {/* radio-style button */}
        <button
          onClick={handle}
          disabled={done || loading}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 shrink-0 ${
            done
              ? "bg-green-500 border-green-500 text-white scale-110"
              : "border-zinc-500 hover:border-indigo-400 hover:scale-105"
          }`}
        >
          {loading ? (
            <div className="w-3 h-3 border border-zinc-400 border-t-transparent rounded-full animate-spin" />
          ) : done ? (
            <svg className="w-3.5 h-3.5" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            /* empty inner dot hint on hover */
            <div className="w-2 h-2 rounded-full bg-transparent group-hover:bg-indigo-400/30" />
          )}
        </button>

        <div>
          <p className={`text-sm font-medium transition-all ${done ? "line-through text-zinc-500" : ""}`}>
            {habit.name}
          </p>
          <p className="text-xs text-zinc-500">{habit.category}</p>
        </div>
      </div>

      <div className="text-right">
        <p className="text-xs text-zinc-400">🔥 {habit.currentStreak}d</p>
        {habit.reminderTime && (
          <p className="text-xs text-zinc-500">⏰ {habit.reminderTime}</p>
        )}
      </div>
    </div>
  );
};

/* ── Activity item ────────────────────────────────────────────────── */
const ActivityItem = ({ log }) => {
  const statusColor =
    log.status === "completed"
      ? "text-green-400 bg-green-900/20"
      : "text-red-400 bg-red-900/20";
  const icon = log.status === "completed" ? "✅" : "❌";

  return (
    <div className="flex items-center gap-3">
      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor}`}>
        {icon} {log.status}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-zinc-300 truncate">
          {log.habitId?.name ?? "Habit"}
        </p>
      </div>
      <p className="text-xs text-zinc-500 shrink-0">
        {new Date(log.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
      </p>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════ */
const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [habits, setHabits] = useState([]);
  const [logs, setLogs] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  // ✅ tracks which habit IDs the user completed this session
  const [completedIds, setCompletedIds] = useState(new Set());
  const [quote] = useState(
    MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]
  );

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [profileRes, habitsRes, leaderboardRes] = await Promise.all([
          axiosInstance.get("/gamification/profile"),
          axiosInstance.get("/habit"),
          axiosInstance.get("/gamification/leaderboard"),
        ]);
        setProfile(profileRes.data.data);
        setHabits(habitsRes.data.data);
        setLeaderboard(leaderboardRes.data.data);

        // fetch logs for each habit to show recent activity
        const allLogs = await Promise.all(
          habitsRes.data.data.slice(0, 5).map((h) =>
            axiosInstance.get(`/habit/${h._id}/logs`).then((r) => r.data.data ?? [])
          )
        );
        setLogs(allLogs.flat().slice(0, 8));
      } catch (err) {
        console.error("Dashboard fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const completeHabit = async (habitId) => {
    try {
      await axiosInstance.post(`/habit/${habitId}/completed`);
      // ✅ add to set so HabitRow fills and ring updates immediately
      setCompletedIds((prev) => new Set([...prev, habitId]));
    } catch (err) {
      alert(err.response?.data?.message || "Could not mark habit complete");
    }
  };

  /* derived stats */
  const myRank = profile
    ? leaderboard.findIndex((u) => u._id === profile._id) + 1
    : null;
  const totalHabits = habits.length;
  const todayDay = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][new Date().getDay()];
  const todaysHabits = habits.filter(
    (h) => !h.repeatDays?.length || h.repeatDays.includes(todayDay)
  );
  const completedToday = logs.filter(
    (l) =>
      l.status === "completed" &&
      new Date(l.date).toDateString() === new Date().toDateString()
  ).length;
  // ✅ union: habits already completed before load + ones completed this session
  const totalCompletedToday = new Set([
    ...logs
      .filter(
        (l) =>
          l.status === "completed" &&
          new Date(l.date).toDateString() === new Date().toDateString()
      )
      .map((l) => l.habitId?._id ?? l.habitId),
    ...completedIds,
  ]).size;
  const completionPct =
    todaysHabits.length > 0
      ? Math.round((totalCompletedToday / todaysHabits.length) * 100)
      : 0;

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">

      {/* ── Greeting banner ── */}
      <div className="bg-linear-to-r from-indigo-900/50 to-violet-900/30 border border-indigo-800/40 rounded-2xl px-6 py-5 flex items-center justify-between">
        <div>
          <p className="text-zinc-400 text-sm">{greet()},</p>
          <h1 className="text-2xl font-bold">{profile?.name ?? "there"} 👋</h1>
          <p className="text-sm text-zinc-400 mt-1">
            {completionPct === 100
              ? "All habits done today! You're crushing it 🔥"
              : todaysHabits.length === 0
              ? "No habits scheduled today — enjoy the rest!"
              : `${totalCompletedToday} of ${todaysHabits.length} habits done today`}
          </p>
        </div>
        {/* circular progress */}
        <div className="relative w-16 h-16 shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#27272a" strokeWidth="3" />
            <circle
              cx="18" cy="18" r="15.9" fill="none"
              stroke="#6366f1" strokeWidth="3"
              strokeDasharray={`${completionPct} 100`}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
            {completionPct}%
          </span>
        </div>
      </div>

      {/* ── Quick stats row ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: "⚡", label: "Level", value: profile?.level ?? 0 },
          { icon: "✨", label: "Total XP", value: profile?.xp ?? 0 },
          { icon: "📋", label: "Habits", value: totalHabits },
          { icon: "🏆", label: "Rank", value: myRank ? `#${myRank}` : "—" },
        ].map(({ icon, label, value }) => (
          <div key={label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
            <p className="text-xl font-bold">{icon} {value}</p>
            <p className="text-xs text-zinc-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* ── Left 2 cols ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Today's Habits */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold">Today's Habits</h2>
              <span className="text-xs text-zinc-500">
                {todayDay} · {todaysHabits.length} scheduled
              </span>
            </div>

            {todaysHabits.length === 0 ? (
              <p className="text-sm text-zinc-500 text-center py-6">
                Nothing scheduled for today 🎉
              </p>
            ) : (
              <div className="space-y-2">
                {todaysHabits.map((h) => (
                  <HabitRow
                    key={h._id}
                    habit={h}
                    done={completedIds.has(h._id)}
                    onComplete={completeHabit}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <h2 className="font-semibold mb-4">Recent Activity</h2>
            {logs.length === 0 ? (
              <p className="text-sm text-zinc-500 text-center py-6">No recent activity yet.</p>
            ) : (
              <div className="space-y-3">
                {logs.map((log, i) => (
                  <ActivityItem key={i} log={log} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Right col ── */}
        <div className="space-y-5">

          {/* XP & Level */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-sm">Level Progress</h2>
              <span className="text-xs bg-indigo-600/30 text-indigo-300 px-2 py-0.5 rounded-full">
                Lvl {profile?.level}
              </span>
            </div>
            <XPBar xp={profile?.xp ?? 0} level={profile?.level ?? 1} />
            <p className="text-xs text-zinc-500">
              {profile?.badges?.length ?? 0} badges earned
            </p>
          </div>

          {/* Streak summary */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3">
            <h2 className="font-semibold text-sm">🔥 Streak Summary</h2>
            {habits.length === 0 ? (
              <p className="text-xs text-zinc-500">No habits yet.</p>
            ) : (
              <div className="space-y-2">
                {habits
                  .sort((a, b) => b.currentStreak - a.currentStreak)
                  .slice(0, 4)
                  .map((h) => (
                    <div key={h._id} className="flex justify-between items-center text-sm">
                      <span className="text-zinc-300 truncate max-w-30">{h.name}</span>
                      <span className="text-orange-400 font-semibold">
                        🔥 {h.currentStreak}d
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Leaderboard preview */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3">
            <h2 className="font-semibold text-sm">🏆 Top Players</h2>
            <div className="space-y-2">
              {leaderboard.slice(0, 5).map((user, i) => {
                const isMe = user._id === profile?._id;
                return (
                  <div
                    key={user._id}
                    className={`flex items-center gap-2 text-sm rounded-lg px-2 py-1 ${
                      isMe ? "bg-indigo-600/10 text-indigo-300" : ""
                    }`}
                  >
                    <span className="w-5 text-center text-xs font-bold text-zinc-400">
                      {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                    </span>
                    <span className="flex-1 truncate">
                      {user.name} {isMe && "(you)"}
                    </span>
                    <span className="text-xs text-zinc-400">{user.xp} XP</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Quote */}
          <div className="bg-linear-to-br from-zinc-900 to-indigo-950/30 border border-indigo-900/40 rounded-2xl p-5 space-y-2">
            <h2 className="font-semibold text-sm">🤖 Daily Motivation</h2>
            <p className="text-sm text-zinc-300 leading-relaxed italic">"{quote}"</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;