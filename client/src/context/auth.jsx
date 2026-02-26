import axios from "axios";
import { useState } from "react";
import { createContext } from "react";
import axiosInstance from "../api/axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setuser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getMe = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/auth/profile");
      setuser(res.data.data);
      return res.data.data;
    } catch (error) {
      setuser(null);
      localStorage.removeItem("token");
      delete axiosInstance.defaults.headers.common["Authorization"]
      console.log("Session Expired", error.message);
    } finally {
      setLoading(false);
    }
  },[])

  const register = async (data) => {
    try {
      const res = await axiosInstance.post("/auth/register", data);
      let token = res.data.token;
      
      if (token) {
        localStorage.setItem("token", token);
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`
        await getMe(token);
        return res.data;
      }
    } catch (error) {
      console.error("Register Error:", error.response?.data?.message);
      throw error;
    }
  };

  const login = async (data) => {
    try {
      const res = await axiosInstance.post("/auth/login", data);

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        await getMe(res.data.token);
        return res.data;
      }
    } catch (error) {
      console.error("Login Error:", error.response?.data?.message);
      throw error;
    }
  };

  const logOut = async () => {
    try {
      // Optional: Call backend logout if needed
      await axiosInstance.post("/auth/logout");
    } catch (error) {
      console.log("Logout error", error);
    } finally {
      localStorage.removeItem("token");
      delete axiosInstance.defaults.headers.common["Authorization"];
      setuser(null);
      navigate("/login");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getMe();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ register, user, setuser, getMe, login, logOut, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export default AuthProvider;
