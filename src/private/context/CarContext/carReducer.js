import { carTypes } from "./types/carTypes";

export const carReducer = (state = {}, action) => {
  switch (action.type) {
    case carTypes.car_success:
      console.log("entra al succes");
      return {
        ...state,
        ...action.payload,
        isLoading: false,
        error: null,
        found: true,
        notFound: false,
      };
    case carTypes.car_request:
      return {
        ...state,
        isLoading: true,
        found: false,
      };
    case carTypes.car_failure:
      console.log("entra al failure");
      return {
        ...state,
        isLoading: false,
        notFound: true,
        found: false,
        error: action.payload,
      };
    case carTypes.car_create:
      console.log("entra al create");
      return {
        ...state,
        ...action.payload,
        isLoading: false,
        error: null,
        found: true,
        notFound: false,
      };
    default:
      return state;
  }
};
