import React from "react";
import { useState } from "react";
import Input from "../core/Input";
import { useContext } from "react";
import { AuthContext } from "../../context/auth";
import Button from "../core/Button";
import { Link } from "react-router-dom";

const Register = () => {
  const { register } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    conformPassword: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const SubmitFormData = async (e) => {
    e.preventDefault();

    const result = await register(formData);

    if (result.data.success) {
      console.log("object");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl p-8 space-y-6 shadow-lg">
        {/* Heading */}
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold text-white">Create Account</h1>
          <p className="text-sm text-zinc-400">
            Join HabitIQ and start building streaks 🚀
          </p>
        </div>

        {/* Form */}
        <form onSubmit={SubmitFormData} className="space-y-4">
          <Input
            label="Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="HabitIQ"
          />

          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="example@gmail.com"
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••"
          />

          <Input
            label="Confirm Password"
            type="password"
            name="conformPassword"
            value={formData.conformPassword}
            onChange={handleChange}
            placeholder="••••••"
          />
          <Button type="submit" target="" className="w-full" active={true}>
            Create Account
          </Button>
          <div className="mt-6 text-center text-sm text-gray-400">
            You have already an account?{" "}
            <Link
              to="/login"
              className="text-indigo-400 hover:text-indigo-300 font-medium transition"
            >
              Login
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Register;
