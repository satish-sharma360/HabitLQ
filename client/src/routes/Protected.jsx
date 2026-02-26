import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/auth";

const Protected = () => {
  let token = localStorage.getItem("token")
  const {user ,loading} = useContext(AuthContext)
  
  if (loading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center text-white">
        <div className="animate-pulse font-bold text-xl tracking-widest text-indigo-500">
          HABIT IQ
        </div>
      </div>
    );
  }
  return token && user ? <Outlet /> : <Navigate to="/" replace />;
};

export default Protected;
