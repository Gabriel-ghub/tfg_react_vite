import { useState, useEffect } from "react";

const useHttp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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
    headers = {}
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
        clearError();
        setIsLoading(false);
        return responseData;
      } else {
        const errorResponse = await response.json();
        setError(errorResponse.errors || "Error en la petición");
        setIsLoading(false);
        return null;
      }
    } catch (err) {
      setError(err.message || "Error en la petición");
      setIsLoading(false);
      return null;
    }
  };

  const clearError = () => {
    setError(null);
  };

  return { isLoading, error, sendRequest, clearError, setIsLoading };
};

export default useHttp;