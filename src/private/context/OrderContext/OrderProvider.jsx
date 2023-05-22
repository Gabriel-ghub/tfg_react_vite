import React, { useReducer } from "react";
import { OrderContext } from "./OrderContext";
import { orderReducer } from "./orderReducer";
import { orderTypes } from "./types/orderTypes";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../api/api";
import useHttp from "../../../hooks/useHttp";

const init = () => {
  return {
    id: null,
    date_in: null,
    kilometres: null,
    state: null,
    name: null,
    surname: null,
    phone: null,
    email: null,
    car_id: null,
    isLoading: false,
    error: null,
  };
};
export const OrderProvider = ({ children }) => {
  const [orderState, dispatch] = useReducer(orderReducer, {}, init);
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("token"));
  const url_anomaly = `${BASE_URL}/anomaly/create`;
  const url_order = `${BASE_URL}/order/create`;
  const {sendRequest, isLoading, error, clearError, setError} = useHttp();

  const orderAction = (order) => {
    const action = {
      type: orderTypes.created,
      payload: order,
    };
    dispatch(action);
  };

  async function handleCreateOrder(order, anomalies) {
    if(!anomalies || anomalies.length < 1){
      dispatch({ type: orderTypes.order_failure, payload: "Debe tener al menos una anomalía"});
      return;
    }
    dispatch({ type: orderTypes.order_request });
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    }

    const body = JSON.stringify(order)

    const response = await sendRequest(url_order, "POST", body, headers)
    if(response){
      dispatch({ type: orderTypes.order_success, payload: response.data });
      let data = anomalies.map((anomaly) => {
        return anomaly.description;
      });
      let data_anomalias = {
        anomalias: data,
        order_id: response.data.id,
      };

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }

      const body = JSON.stringify(data_anomalias)
       
      const response2 = await sendRequest(url_anomaly, "POST", body, headers)
      if(response2){
        console.log("Lllega hasta ca  ")
        navigate(`/orders/${response2}/details`);
      }else{
        dispatch({ type: orderTypes.order_failure, payload: "Error en la peticion" });
      }

    }else{
      dispatch({ type: orderTypes.order_failure, payload: "Error en la peticion" });
    }

    // fetch(url_order, {
    //   method: "POST",
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(order),
    // })
    //   .then((response) => {
    //     if (!response.ok) {
    //       throw new Error(response.statusText);
    //     }
    //     return response.json();
    //   })
    //   .then((res) => {
    //     dispatch({ type: orderTypes.order_success, payload: res.data });
    //     let data = anomalies.map((anomaly) => {
    //       return anomaly.description;
    //     });
    //     let data_anomalias = {
    //       anomalias: data,
    //       order_id: res.data.id,
    //     };
    //     fetch(url_anomaly, {
    //       method: "POST",
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify(data_anomalias),
    //     })
    //       .then((res) => {
    //         return res.json();
    //       })
    //       .then((res) => {
    //         console.log("el paramtro que llega de order id es")
    //         console.log("estas en la respuesta de la api")
    //         console.log(res);
    //         navigate(`/orders/${res}/details`);
    //       })
    //       .catch((err) => console.log(err));
    //   })
    //   .catch((error) => {
    //     dispatch({ type: orderTypes.order_failure, payload: error.message });
    //   });
  }

  return (
    <OrderContext.Provider
      value={{ orderAction, handleCreateOrder, ...orderState,error,clearError }}
    >
      {children}
    </OrderContext.Provider>
  );
};
