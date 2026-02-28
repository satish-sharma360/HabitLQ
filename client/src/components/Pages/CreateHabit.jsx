import React, { useState } from "react";
import Input from "../core/Input";
import axiosInstance from "../../api/axios";

const CATEGORIES = ["Health", "Study", "Fitness", "Productivity", "Custom"];
const ALL_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const CreateHabit = ({ switchToggle }) => {
  
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    reminderTime: "",
    repeatDays: [],
  });



  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleDay = (day) => {
    setFormData((prev) => ({
      ...prev,
      repeatDays: prev.repeatDays.includes(day)
        ? prev.repeatDays.filter((d) => d !== day)
        : [...prev.repeatDays, day],
    }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault()
    try {
        const res = await axiosInstance.post(`/habit`,formData)
        switchToggle()
    } catch (error) {
        alert("Error creating Habit")
        console.log("Error in Creating Habit" ,error)
    }
  };
  return (
    <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 max-w-md w-full">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-semibold">Create New Habit</h2>
      <button
        type="button"
        onClick={switchToggle}
        className=" text-white cursor-pointer hover:text-white/50 px-2 py-1 rounded bg-zinc-700 border border-zinc-600"
      >
        ✕
      </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div className="space-y-1">
          <label className="text-sm text-zinc-400">Habit Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Morning Meditation"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Category Dropdown */}
        <div className="space-y-1">
          <label className="text-sm text-zinc-400">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="">Select category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Reminder Time */}
        <div className="space-y-1">
          <label className="text-sm text-zinc-400">Reminder Time</label>
          <input
            type="time"
            name="reminderTime"
            value={formData.reminderTime}
            onChange={handleChange}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Repeat Days — toggle buttons */}
        <div className="space-y-2">
          <label className="text-sm text-zinc-400">Repeat Days</label>
          <div className="flex flex-wrap gap-2">
            {ALL_DAYS.map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                className={`px-3 py-1 rounded-lg text-sm font-medium border transition-colors ${
                  formData.repeatDays.includes(day)
                    ? "bg-indigo-600 border-indigo-500 text-white"
                    : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-indigo-500"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded-lg text-sm font-medium mt-2"
        >
          Create Habit ➕
        </button>
      </form>
    </div>
  );
};

export default CreateHabit;
