import React from "react";
import { AuthProvider } from "./auth/context/AuthProvider";
import { AppRouter } from "./router/AppRouter";
import "./index.css";
import { ErrorProvider } from "./context/ErrorProvider";

export const MecanicaApp = () => {
  return (
    <>
      <AuthProvider>
        <ErrorProvider>
          <AppRouter />
        </ErrorProvider>
      </AuthProvider>
    </>
  );
};
