import React from "react";
import Button from "./components/core/Button";
import { Route, Routes } from "react-router-dom";
import Protected from "./routes/Protected";
import Landing from "./components/Pages/Landing";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route element={Protected}>
        <Route path="/dashboard" element={<h1>user dashboard</h1>} />
      </Route>
    </Routes>
  );
};

export default App;
