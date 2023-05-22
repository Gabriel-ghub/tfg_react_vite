import React, { useReducer, useState } from "react";
import { useToken } from "../../hooks/useToken";
import { types } from "../types/types";
import { AuthContext } from "./AuthContext";
import { authReducer } from "./authReducer";
import { BASE_URL } from "../../api/api";
import { useEffect } from "react";

function enviarTokenBearer(url, token) {
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => {
        resolve(res.json())
      })
      .catch((err) => {
        reject(err)
      })
  })
}
let token = JSON.parse(localStorage.getItem("token"));

const init = () => {
  return {
    isAuthenticated: !!token,
    isLoading: false,
    user: null,
    error: null,
  };
};
let refresh = 0;

export const AuthProvider = ({ children }) => {
  const [authState, dispatch] = useReducer(authReducer, {}, init);
  const [loading, setloading] = useState(false);
  const { getToken } = useToken();

  useEffect(() => {
    if (token) {
      const url = `${BASE_URL}/me`;
      enviarTokenBearer(url, token)
        .then(res => {
          setRefreshToken(token)
        })
        .catch(err => {
          onLogout()
        });
    }
  }
  , [])


  async function onLogin(email, password) {
    if (email === "" || password === "") {
      dispatch({
        type: "LOGIN_FAILURE",
        payload: "Ingrese un usuario y contraseña",
      });
      return;
    }
    dispatch({ type: "LOGIN_REQUEST" });
    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setRefreshToken(data.access_token)
        dispatch({ type: "LOGIN_SUCCESS", payload: data.user });
      } else {
        dispatch({ type: "LOGIN_FAILURE", payload: data.error });
      }
    } catch (error) {
      dispatch({ type: "LOGIN_FAILURE", payload: error.message });
    }
  }

  function setRefreshToken(token) {
    localStorage.setItem("token", JSON.stringify(token));
    if (!refresh) {
      refresh = setInterval(refreshToken, 1200000)
    }
  }

  async function refreshToken() {
    try {
      const url = `${BASE_URL}/refresh`
      const token = getToken()
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      localStorage.setItem("token", JSON.stringify(data.access_token))
    } catch (error) {
      console.log(error)
    }
  }

  const onLogout = () => {
    console.log("logout, deberia limpiarse")

    clearInterval(refresh)
    refresh = 0;

    localStorage.removeItem("user");
    localStorage.removeItem("token");

    const action = {
      type: types.lg_logout,
    };

    dispatch(action);
  };

  return (
    <AuthContext.Provider value={{ onLogin, onLogout, ...authState, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
