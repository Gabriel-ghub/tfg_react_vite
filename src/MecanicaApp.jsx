import React from "react";
import { AuthProvider } from "./auth/context/AuthProvider";
import { AppRouter } from "./router/AppRouter";
import "./index.css";

export const MecanicaApp = () => {
  return (
    <>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </>
  );
};
