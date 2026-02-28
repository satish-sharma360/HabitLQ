import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import Loader from "../core/Loader";
import CreateHabit from "./CreateHabit";

/* ─── Single Habit Detail Modal ──────────────────────────────────────────── */
const HabitModal = ({ habitId, onClose }) => {
  const [habit, setHabit] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [habitRes, logsRes] = await Promise.all([
          axiosInstance.get(`/habit/${habitId}`),
          axiosInstance.get(`/habit/${habitId}/logs`),
        ]);
        setHabit(habitRes.data.data);
        setLogs(logsRes.data.data || []);
      } catch (err) {
        console.error("Error fetching habit details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [habitId]);

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-zinc-900 border border-zinc-700 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition text-xl leading-none"
        >
          ✕
        </button>

        {loading ? (
          <div className="flex justify-center py-10">
            <span className="text-zinc-400 text-sm animate-pulse">Loading…</span>
          </div>
        ) : !habit ? (
          <p className="text-zinc-400 text-center py-8">Could not load habit.</p>
        ) : (
          <>
            {/* Title & category */}
            <h2 className="text-xl font-bold mb-1">{habit.name}</h2>
            <span className="inline-block text-xs bg-indigo-600/30 text-indigo-300 px-2 py-0.5 rounded-full mb-4">
              {habit.category}
            </span>

            {/* Stats row */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              {[
                { label: "Current Streak", value: `${habit.currentStreak} days`, icon: "🔥" },
                { label: "Longest Streak", value: `${habit.longestStreak} days`, icon: "⭐" },
                { label: "Reminder", value: habit.reminderTime || "—", icon: "⏰" },
                {
                  label: "Repeat Days",
                  value: habit.repeatDays?.join(", ") || "None",
                  icon: "📅",
                },
              ].map(({ label, value, icon }) => (
                <div key={label} className="bg-zinc-800 rounded-xl p-3">
                  <p className="text-xs text-zinc-400 mb-0.5">{icon} {label}</p>
                  <p className="text-sm font-medium truncate">{value}</p>
                </div>
              ))}
            </div>

            {/* Logs */}
            <div>
              <h3 className="text-sm font-semibold text-zinc-300 mb-2">Recent Logs</h3>
              {logs.length === 0 ? (
                <p className="text-xs text-zinc-500 italic">No logs yet.</p>
              ) : (
                <ul className="space-y-1.5 max-h-40 overflow-y-auto pr-1 scrollbar-thin">
                  {logs.map((log, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between bg-zinc-800 rounded-lg px-3 py-2 text-xs"
                    >
                      <span className="text-zinc-300">
                        {new Date(log.date).toLocaleDateString(undefined, {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <span
                        className={`font-semibold ${
                          log.status === "completed"
                            ? "text-green-400"
                            : log.status === "missed"
                            ? "text-red-400"
                            : "text-yellow-400"
                        }`}
                      >
                        {log.status}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

/* ─── Habit Card ─────────────────────────────────────────────────────────── */
const HabitCard = ({ elem, onComplete, onDelete, onView }) => {
  const [completing, setCompleting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleComplete = async () => {
    setCompleting(true);
    await onComplete(elem._id);
    setCompleting(false);
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${elem.name}"?`)) return;
    setDeleting(true);
    await onDelete(elem._id);
    // component will unmount after deletion, no need to reset
  };

  return (
    <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800 space-y-3 flex flex-col hover:border-zinc-600 transition-colors">
      {/* Name + category */}
      <div>
        <h2 className="font-semibold text-base leading-tight">{elem.name}</h2>
        <span className="text-xs text-indigo-400">{elem.category}</span>
      </div>

      {/* Streaks */}
      <div className="flex gap-3">
        <div className="flex-1 bg-zinc-800 rounded-lg p-2 text-center">
          <p className="text-lg font-bold">{elem.currentStreak}</p>
          <p className="text-xs text-zinc-400">🔥 Current</p>
        </div>
        <div className="flex-1 bg-zinc-800 rounded-lg p-2 text-center">
          <p className="text-lg font-bold">{elem.longestStreak}</p>
          <p className="text-xs text-zinc-400">⭐ Best</p>
        </div>
      </div>

      {/* Meta */}
      <p className="text-xs text-zinc-400">⏰ {elem.reminderTime || "No reminder"}</p>
      <p className="text-xs text-zinc-400">
        📅 {elem.repeatDays?.join(", ") || "No days set"}
      </p>

      {/* Actions */}
      <div className="flex gap-2 pt-1 mt-auto">
        <button
          onClick={handleComplete}
          disabled={completing}
          className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 py-1.5 rounded-lg text-xs font-medium transition-colors"
        >
          {completing ? "…" : "✓ Complete"}
        </button>
        <button
          onClick={() => onView(elem._id)}
          className="bg-indigo-600 hover:bg-indigo-700 px-3 rounded-lg text-xs font-medium transition-colors"
          title="View details"
        >
          View
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="bg-red-600 hover:bg-red-700 disabled:opacity-50 px-3 rounded-lg text-xs font-medium transition-colors"
          title="Delete habit"
        >
          {deleting ? "…" : "✕"}
        </button>
      </div>
    </div>
  );
};

/* ─── Main Habits Page ───────────────────────────────────────────────────── */
const Habits = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toggle, setToggle] = useState(false);
  const [selectedHabitId, setSelectedHabitId] = useState(null);

  /* ── API helpers ── */
  const allHabits = async () => {
    try {
      const { data } = await axiosInstance.get("/habit");
      setHabits(data.data);
    } catch (error) {
      alert("Error fetching habits");
      console.error("Error fetching habits", error);
    } finally {
      setLoading(false);
    }
  };

  const completeHabit = async (habitId) => {
    try {
      const res = await axiosInstance.post(`/habit/${habitId}/completed`);
      console.log(res)
      alert("Habit completed! 🎉");
      await allHabits();
    } catch (error) {
      alert(error.response?.data?.message || "Error completing habit");
      console.error("Error completing habit", error);
    }
  };

  const deleteHabit = async (habitId) => {
    try {
      await axiosInstance.delete(`/habit/${habitId}`);
      // Optimistic update — remove from state without refetch
      setHabits((prev) => prev.filter((h) => h._id !== habitId));
    } catch (error) {
      alert(error.response?.data?.message || "Error deleting habit");
      console.error("Error deleting habit", error);
    }
  };

  useEffect(() => {
    allHabits();
  }, []);

  if (loading) return <Loader />;

  return (
    <>
      {/* Single habit detail modal */}
      {selectedHabitId && (
        <HabitModal
          habitId={selectedHabitId}
          onClose={() => setSelectedHabitId(null)}
        />
      )}

      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">
            {toggle ? "Create Habit" : "My Habits"}
          </h1>
          <button
            onClick={() => setToggle((t) => !t)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm transition-colors"
          >
            {toggle ? "← Back" : "+ Create Habit"}
          </button>
        </div>

        {toggle ? (
          <CreateHabit
            switchToggle={() => {
              setToggle(false);
              allHabits(); // refresh list after creation
            }}
          />
        ) : habits.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-500 space-y-3">
            <span className="text-4xl">📋</span>
            <p className="text-sm">No habits yet. Create your first one!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {habits.map((elem) => (
              <HabitCard
                key={elem._id}
                elem={elem}
                onComplete={completeHabit}
                onDelete={deleteHabit}
                onView={(id) => setSelectedHabitId(id)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Habits;