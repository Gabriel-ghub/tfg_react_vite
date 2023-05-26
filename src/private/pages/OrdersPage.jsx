import React, { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Loader } from "../../components/Loader";
import useHttp from "../../hooks/useHttp";
import { Main } from "../components/global/Main";
import DataTable from "react-data-table-component";
import { BASE_URL } from "../../api/api";
import { useToken } from "../../hooks/useToken";
import { Error } from "../../components/Error";
import { useForm } from "react-hook-form";

export const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [mensaje, setMensaje] = useState(false);
  const { isLoading, sendRequest, clearError, error, setIsLoading } = useHttp();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const { getToken } = useToken();
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    const token = getToken();
    setMensaje(false);

    const fetchData = async () => {
      try {
        const url = `${BASE_URL}/order/list`;
        const responseData = await sendRequest(url, "GET", null, {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        });
        setOrders(responseData);
      } catch (err) {
        setMensaje(true);
      }
    };
    fetchData();
  }, []);

  const handleCleanForm = () => {
    setFiltered([]);
    setMensaje(false);
    setValue("value", "");
  };
  const validations = {
    required: {
      value: true,
      message: "Campo requerido",
    },
    maxLength: {
      value: 10,
      message: "Máximo 10 caracteres",
    },
    minLength: {
      value: 5,
      message: "Mínimo 5 caracteres",
    },
  };

  const columns = [
    {
      name: "Matrícula",
      selector: (row) => row.plate,
      sortable: true,
    },
    {
      name: "Nombre",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Estado",
      selector: (row) => (row.state === 0 ? "En proceso" : "Finalizada"),
      sortable: true,
    },
    {
      name: "Fecha de entrada",
      selector: (row) => row.date_in,
      sortable: true,
    },
    {
      name: "",
      selector: (row) => {
        return (
          <Link className="btn btn-warning" to={`/orders/${row.id}/details`}>
            {row.state === 0 ? "Editar" : "Ver"}
          </Link>
        );
      },
    },
  ];

  const columnsCar = [
    {
      name: "Matrícula",
      selector: (row) => row.plate,
      sortable: true,
    },
    {
      name: "Estado",
      selector: (row) => (row.state == 0 ? "En proceso" : "Finalizada"),
      sortable: true,
    },
    {
      name: "Fecha de entrada",
      selector: (row) => row.date_in,
      sortable: true,
    },
    {
      name: "",
      selector: (row) => {
        return (
          <Link className="btn btn-warning" to={`/orders/${row.id}/details`}>
            Editar
          </Link>
        );
      },
    },
  ];
  const onSubmit = async (data) => {
    console.log(data);
    setFiltered([]);
    let orders_result = false;
    if (data.filter == "plate") {
      const filtered = orders.filter((order) => order.plate == data.value);
      if (filtered.length > 0) {
        orders_result = filtered;
      }
    } else if (data.filter == "name") {
      const filtered = orders.filter((order) =>
        order.name.toLowerCase().includes(data.value.toLowerCase())
      );
      if (filtered.length > 0) {
        orders_result = filtered;
      }
    } else if (data.filter == "surname") {
      const filtered = orders.filter((order) =>
        order.surname.toLowerCase().includes(data.value.toLowerCase())
      );
      if (filtered.length > 0) {
        orders_result = filtered;
      }
    }
    if (!orders_result) {
      setMensaje("No se encontraron resultados");
    }
  };

  return (
    <>
      <Main page={"orders_page"}>
        <div className="row mt-5">
          <h2 className="text-center">Listado de órdenes</h2>
          <div className="col-12 p-4 shadow-lg">
            <h4>Filtro</h4>
            <form onSubmit={handleSubmit(onSubmit)} className="col-12 col-md-4">
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  {...register("value", validations)}
                />
                <select className="form-select mt-2" {...register("filter")}>
                  <option value="plate" className="">
                    Matricula
                  </option>
                  <option value="name">Nombre</option>
                  <option value="surname">Apellido</option>
                </select>
              </div>
              {mensaje && <Error error={mensaje} />}
              {errors && errors.value && (
                <p className="my-1">{errors.value.message}</p>
              )}
              {isLoading ? (
                <Loader />
              ) : (
                <div className="mt-3 d-flex gap-2">
                  <button type="submit" className="btn btn-primary">
                    Buscar
                  </button>
                  <button onClick={handleCleanForm} className="btn btn-warning">
                    Limpiar
                  </button>
                </div>
              )}
            </form>
            {isLoading && <Loader></Loader>}

            {!isLoading && orders.length > 0 && (
              <DataTable
                columns={columns}
                data={filtered.length > 0 ? filtered : orders}
                pagination
              />
            )}
          </div>
        </div>
      </Main>
    </>
  );
};
