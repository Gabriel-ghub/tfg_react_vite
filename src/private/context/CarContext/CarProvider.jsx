import React, { useReducer } from "react";
import { CarContext } from "./CarContext";
import { carReducer } from "./carReducer";
import { carTypes } from "./types/carTypes";
import { BASE_URL } from "../../../api/api";
import useHttp from "../../../hooks/useHttp";

const init = () => {
  return {
    id: "",
    plate: "",
    brand: "",
    model: "",
    isLoading: false,
    error: null,
  };
};
export const CarProvider = ({ children }) => {
  const { isLoading, sendRequest ,error, clearError} = useHttp();
  const [carState, dispatch] = useReducer(carReducer, {}, init);

  const carFound = (car) => {
    const action = {
      type: carTypes.found,
      payload: car,
    };
    dispatch(action);
  };

  const carNotFound = () => {
    const action = {
      type: carTypes.error,
    };
    dispatch(action);
  };

  const getCarInfo = async (matricula) => {

      dispatch({ type: carTypes.car_request });
      const token = JSON.parse(localStorage.getItem("token"));
      const url = `${BASE_URL}/car/search?plate=${matricula}`;
      const  headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
      const response = await sendRequest(url,"GET",null,headers)
      if (response) {
        dispatch({
          type: carTypes.car_success,
          payload: {
            id: response.id,
            plate: response.plate,
            brand: response.brand,
            model: response.model,
          },
        });
      }else{
        dispatch({ type: carTypes.car_failure, payload: "Error al encontrar coche" });
      }
  };

  const createNewCar = ({ plate, brand, model, id }) => {
    const data = {
      plate,
      brand,
      model,
      id,
    };
    const action = {
      type: carTypes.car_create,
      payload: data,
    };

    dispatch(action);
  };

  return (
    <CarContext.Provider
      value={{ getCarInfo, carNotFound, carFound, createNewCar, ...carState }}
    >
      {children}
    </CarContext.Provider>
  );
};
