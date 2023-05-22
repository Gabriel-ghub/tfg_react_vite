import { orderTypes } from "./types/orderTypes";

export const orderReducer = (state = {}, action) => {
  switch (action.type) {
    case orderTypes.order_request:
      return { ...state, isLoading: true, error: null };
    case orderTypes.order_success:
      return { ...state, ...action.payload, isLoading: false };
    case orderTypes.order_failure:
      return { ...state, isLoading: false, error: action.payload };
    default:
      return state;
  }
};
