import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../auth/context/AuthContext";

export const PublicRoute = ({ children }) => {
  console.log("pasa por el public route")
  const { isAuthenticated } = useContext(AuthContext);
  return (!isAuthenticated) ? children : <Navigate to={"/home"} />;
};
