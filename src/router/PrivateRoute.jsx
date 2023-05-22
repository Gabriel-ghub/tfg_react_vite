import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../auth/context/AuthContext";
export const PrivateRoute = ({children}) => {
  // console.log("pasa por el private route")
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? children : <Navigate to={"/login"} />;
};
