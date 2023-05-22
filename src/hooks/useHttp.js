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
      console.log(response)
      if (response.ok) {
        const responseData = await response.json();
        clearError();
        setIsLoading(false);
        return responseData;
      } else {
        const errorResponse = await response.json();
        console.log(errorResponse)
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


// try {
//   const response = await fetch(url, {
//     method,
//     body,
//     headers,
//     signal: abortController.signal,
//   });
//   if (!response.ok) {
//     throw new Error(
//       JSON.stringify({code:response.status,ok:response.ok})
//     );
//   }
//   const responseData = await response.json();
//   clearError();
//   setIsLoading(false);
//   return responseData;
// } catch (err) {
//   console.log("linea antes del setLoadingfalse")
//   setIsLoading(false);
//   const errores = JSON.parse(err)
//   console.log(errores)
//   return
//   return err;
// }