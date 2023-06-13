import { useState, useEffect } from "react";
import { useToken } from "./useToken";
import { useForm } from "react-hook-form";


const useHttpNew = () => {
  const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState(null);
  const { setError, clearErrors } = useForm();
  const { getToken } = useToken();

  useEffect(() => {
    const abortController = new AbortController();

    return () => {
      abortController.abort();
    };
  }, []);

  const sendRequest = async (
    url,
    method = "GET",
    body = null,
    headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    }
  ) => {
    setIsLoading(true);
    let abortController;
    if (typeof AbortController !== "undefined") {
      abortController = new AbortController();
    }
    try {
      const response = await fetch(url, {
        method,
        body,
        headers,
        signal: abortController.signal,
      });
      if (response.ok) {
        const responseData = await response.json();
        clearErrors();
        setIsLoading(false);
        return responseData;
      } else {
        const errorResponse = await response.json();
        console.log(errorResponse)
        // setError(errorResponse.errors || "Error en la petición.");
        setIsLoading(false);
        return null;
      }
    } catch (err) {
      // setError(err.message || "Error en la petición.");
      console.log()
      setIsLoading(false);
      return null;
    }
  };


  return { isLoading,sendRequest, setIsLoading };
};

export default useHttpNew;