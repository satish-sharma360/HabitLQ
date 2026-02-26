import axios from "axios";
import { useState } from "react";
import { createContext } from "react";
import axiosInstance from "../api/axios";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setuser] = useState(null);

  const getMe = async () => {
    try {
      const res = await axiosInstance.get("/auth/profile");
      console.log(res);
      setuser(res.data.user)
      return res.data
    } catch (error) {
        setuser(null)
        console.log("Session Expired" , error.message)
    }
  };
  const register = async (data) => {
    try {
      const res = await axiosInstance.post("/auth/register", data);
      let token = res.data.token;
      if (token) {
        localStorage.setItem("token",token);
        await getMe();
      }
    } catch (error) {
      console.log("Error in register", error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ register, user, setuser }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthProvider;
