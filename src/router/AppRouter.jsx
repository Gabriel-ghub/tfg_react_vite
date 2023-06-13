import { Route, Routes } from "react-router-dom";
import { LoginPage } from "../auth/pages/LoginPage";
import { RouterApp } from "../private/router/RouterApp";
import { StudentRouterApp } from "../private/router/StudentRouterApp";
import { PrivateRoute } from "./PrivateRoute";
import { PublicRoute } from "./PublicRoute";
import { AuthContext } from "../auth/context/AuthContext";
import { useContext } from "react";
import { useToken } from "../hooks/useToken";
export const AppRouter = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const token = localStorage.getItem("token");
  const { get_decoded_token } = useToken(token);
  let role_id = null;
  if (isAuthenticated) {
    const token_decoded = get_decoded_token();
    role_id = token_decoded != undefined ? token_decoded.user.role_id : null;
  }
  //TODO: VERIFICAR ESTO
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      ></Route>

      <Route
        path="/*"
        element={
          <PrivateRoute>
            {isAuthenticated && role_id == 1 && <RouterApp />}
            {isAuthenticated && role_id == 2 && <StudentRouterApp />}
          </PrivateRoute>
        }
      ></Route>
    </Routes>
  );
};
