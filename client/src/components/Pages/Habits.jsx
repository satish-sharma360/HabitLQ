import axios from "axios";
import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import Loader from "../core/Loader";
import CreateHabit from "./CreateHabit";

const Habits = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  const [toggle, setToggle] = useState(false);

  const allHabits = async () => {
    try {
      const { data } = await axiosInstance.get("/habit");
      setHabits(data.data);
    } catch (error) {
      alert("Facing issue Fatching habits");
      console.log("Error Fetching habits", error);
    } finally {
      setLoading(false);
    }
  };

  const completeHabit = async (habbitId) => {
    try {
      const res = await axiosInstance.post(`/habit/${habbitId}/completed`);

      alert("Habit completed! 🎉");
      allHabits();
    } catch (error) {
      alert(error.response?.data?.message || "Error completing habit");
      console.log("Error completing habit", error);
    }
  };

  useEffect(() => {
    allHabits();
  }, []);

  const switchToggle = () => {
    setToggle(!toggle);
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">{toggle?("Create Habits"):("My Habits")}</h1>
        <button
          onClick={() => setToggle(!toggle)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm"
        >
          {
            toggle?("My Habit") : ("Create Habit")
          }
        </button>
      </div>

      {toggle ? (
        <CreateHabit switchToggle={switchToggle} />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {habits.map((elem, index) => {
            return (
              <div
                key={index}
                className="bg-zinc-900 p-5 rounded-xl border border-zinc-800 space-y-3"
              >
                <h2 className="font-semibold">{elem.name}</h2>
                <p className="text-sm text-zinc-400">
                  Category: {elem.category}
                </p>
                <p className="text-sm">
                  🔥Current Streak: {elem.currentStreak} days
                </p>
                <p className="text-sm">
                  ⭐Long Streak: {elem.longestStreak} days
                </p>
                <p className="text-sm text-zinc-400">⏰ {elem.reminderTime}</p>

                <p className="text-sm text-zinc-400">
                  📅 {elem.repeatDays.join(", ") || "No days set"}
                </p>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => completeHabit(elem._id)}
                    className="flex-1 bg-green-600 hover:bg-green-700 py-1 rounded text-sm"
                  >
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
            );
          })}
        </div>
      )}

      {/* Habit Grid */}
    </div>
  );
};

export default Habits;
