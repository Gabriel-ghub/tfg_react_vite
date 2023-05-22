import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../auth/context/AuthContext";

export const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  return (!isAuthenticated) ? children : <Navigate to={"/home"} />;
};
