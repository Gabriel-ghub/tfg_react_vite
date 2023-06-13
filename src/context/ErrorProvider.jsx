import React, { useState } from "react";
import { ErrorContext } from "./ErrorContext";

export const ErrorProvider = ({ children }) => {
  const [errorsServer, setErrorsServer] = useState(null);
  return (
    <ErrorContext.Provider value={{ errorsServer, setErrorsServer }}>
      {children}
    </ErrorContext.Provider>
  );
};
