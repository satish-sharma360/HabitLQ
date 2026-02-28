import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid,
} from "recharts";
import axiosInstance from "../../api/axios";

/* ── Loader ─────────────────────────────────────────────────────── */
const Loader = () => (
  <div className="flex justify-center items-center py-20">
    <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

/* ── Stat card ──────────────────────────────────────────────────── */
const StatCard = ({ icon, label, value, sub }) => (
  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-1">
    <p className="text-xs text-zinc-400">{icon} {label}</p>
    <p className="text-2xl font-bold">{value}</p>
    {sub && <p className="text-xs text-zinc-500">{sub}</p>}
  </div>
);

/* ── Custom Tooltip ─────────────────────────────────────────────── */
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-xs">
      <p className="text-zinc-400 mb-1">{label}</p>
      <p className="font-semibold text-indigo-300">{payload[0].value} completions</p>
    </div>
  );
};

/* ── Heatmap ────────────────────────────────────────────────────── */
const Heatmap = ({ data }) => {
  // build a map of date → count
  const countMap = {};
  data.forEach((d) => { countMap[d._id] = d.count; });

  // generate last 16 weeks of days (112 days)
  const days = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 111; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    days.push({ date: key, count: countMap[key] ?? 0, day: d.getDay() });
  }

  // split into weeks (columns)
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));

  const intensity = (count) => {
    if (count === 0) return "bg-zinc-800";
    if (count === 1) return "bg-indigo-900";
    if (count === 2) return "bg-indigo-700";
    if (count === 3) return "bg-indigo-500";
    return "bg-indigo-400";
  };

  const DAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-1 min-w-max">
        {/* day labels */}
        <div className="flex flex-col gap-1 mr-1">
          {DAY_LABELS.map((d) => (
            <div key={d} className="w-4 h-4 text-[9px] text-zinc-500 flex items-center">
              {d}
            </div>
          ))}
        </div>
        {/* week columns */}
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((day) => (
              <div
                key={day.date}
                title={`${day.date}: ${day.count} completed`}
                className={`w-4 h-4 rounded-sm ${intensity(day.count)} transition-colors cursor-default`}
              />
            ))}
          </div>
        ))}
      </div>
      {/* legend */}
      <div className="flex items-center gap-1.5 mt-2 text-[10px] text-zinc-500">
        <span>Less</span>
        {["bg-zinc-800", "bg-indigo-900", "bg-indigo-700", "bg-indigo-500", "bg-indigo-400"].map((c) => (
          <div key={c} className={`w-3 h-3 rounded-sm ${c}`} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════ */
const Analytics = () => {
  const [weekly, setWeekly] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [heatmap, setHeatmap] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [monthlyView, setMonthlyView] = useState("bar"); // "bar" | "line"

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [wRes, mRes, hRes] = await Promise.all([
          axiosInstance.get("/analysis/weekly"),
          axiosInstance.get("/analysis/monthly"),
          axiosInstance.get("/analysis/heatmap"),
        ]);
        setWeekly(wRes.data.data);
        setMonthly(mRes.data.data);
        setHeatmap(hRes.data.data);
      } catch (err) {
        console.error("Error fetching analytics", err);
        setError("Failed to load analytics.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return <Loader />;
  if (error) return <p className="text-red-400 text-center py-20">{error}</p>;

  /* ── transform weekly data ── */
  // MongoDB $dayOfWeek: 1=Sun … 7=Sat
  const DAY_NAMES = ["", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weeklyChart = [1, 2, 3, 4, 5, 6, 7].map((d) => ({
    day: DAY_NAMES[d],
    count: weekly.find((s) => s._id === d)?.count ?? 0,
  }));

  /* ── transform monthly data ── */
  const monthlyChart = monthly.map((s) => ({
    date: s._id.slice(5), // "MM-DD"
    count: s.count,
  }));

  /* ── summary stats ── */
  const totalWeek = weeklyChart.reduce((a, b) => a + b.count, 0);
  const totalMonth = monthlyChart.reduce((a, b) => a + b.count, 0);
  const bestDay = weeklyChart.reduce((a, b) => (b.count > a.count ? b : a), { day: "—", count: 0 });
  const totalAllTime = heatmap.reduce((a, b) => a + b.count, 0);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">

      {/* header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-sm text-zinc-400 mt-0.5">Your habit completion data at a glance</p>
      </div>

      {/* summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon="📅" label="This Week" value={totalWeek} sub="completions" />
        <StatCard icon="📆" label="This Month" value={totalMonth} sub="completions" />
        <StatCard icon="⭐" label="Best Day" value={bestDay.day} sub={`${bestDay.count} completions`} />
        <StatCard icon="✅" label="All Time" value={totalAllTime} sub="total completed" />
      </div>

      {/* weekly bar chart */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
        <h2 className="font-semibold text-sm">Weekly Completions</h2>
        {totalWeek === 0 ? (
          <p className="text-zinc-500 text-sm text-center py-8">No completions in the last 7 days.</p>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyChart} barSize={28}>
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#71717a" }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#71717a" }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(99,102,241,0.08)" }} />
              <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* monthly chart */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-sm">Monthly Completions (last 30 days)</h2>
          <div className="flex gap-1 bg-zinc-800 rounded-lg p-1">
            {["bar", "line"].map((v) => (
              <button
                key={v}
                onClick={() => setMonthlyView(v)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  monthlyView === v ? "bg-indigo-600 text-white" : "text-zinc-400 hover:text-white"
                }`}
              >
                {v === "bar" ? "Bar" : "Line"}
              </button>
            ))}
          </div>
        </div>
        {totalMonth === 0 ? (
          <p className="text-zinc-500 text-sm text-center py-8">No completions in the last 30 days.</p>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            {monthlyView === "bar" ? (
              <BarChart data={monthlyChart} barSize={12}>
                <XAxis dataKey="date" tick={{ fontSize: 9, fill: "#71717a" }} axisLine={false} tickLine={false} interval={4} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#71717a" }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(99,102,241,0.08)" }} />
                <Bar dataKey="count" fill="#818cf8" radius={[3, 3, 0, 0]} />
              </BarChart>
            ) : (
              <LineChart data={monthlyChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="date" tick={{ fontSize: 9, fill: "#71717a" }} axisLine={false} tickLine={false} interval={4} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#71717a" }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#818cf8"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: "#6366f1" }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        )}
      </div>

      {/* heatmap */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
        <h2 className="font-semibold text-sm">Completion Heatmap (last 16 weeks)</h2>
        <Heatmap data={heatmap} />
      </div>

    </div>
  );
};

export default Analytics;