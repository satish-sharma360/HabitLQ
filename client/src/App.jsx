import React from "react";
import Button from "./components/core/Button";
import { Navigate, Route, Routes } from "react-router-dom";
import Landing from "./components/Pages/Landing";
import Register from "./components/Pages/Register";
import Login from "./components/Pages/Login";
import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./components/Pages/Dashboard";
import Habits from "./components/Pages/Habits";
import Gamification from "./components/Pages/Gamification";
import Analytics from "./components/Pages/Analytics";
import AiCoach from "./components/Pages/AiCoach";
import Feed from "./components/Pages/Feed";
import Profile from "./components/Pages/Profile";
import AdminPanel from "./components/Pages/AdminPanel";
import Protected from "./routes/Protected";

const App = () => {
  return (
    <Routes>
      {/* 🌍 Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      {/* 🔐 Protected */}
      <Route element={<Protected />}>
        <Route path="/dashboard" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
        </Route>

        <Route path="/habits" element={<AppLayout />}>
          <Route index element={<Habits />} />
        </Route>

        <Route path="/gamification" element={<AppLayout />}>
          <Route index element={<Gamification />} />
        </Route>

        <Route path="/analytics" element={<AppLayout />}>
          <Route index element={<Analytics />} />
        </Route>

        <Route path="/ai" element={<AppLayout />}>
          <Route index element={<AiCoach />} />
        </Route>

        <Route path="/feed" element={<AppLayout />}>
          <Route index element={<Feed />} />
        </Route>

        <Route path="/profile" element={<AppLayout />}>
          <Route index element={<Profile />} />
        </Route>

        <Route path="/admin" element={<AppLayout />}>
          <Route index element={<AdminPanel />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
