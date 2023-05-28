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
  const [filterMessage, setFilterMessage] = useState(false);
  const { isLoading, sendRequest, clearError, error, setIsLoading } = useHttp();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    reValidateMode: "onSubmit",
  });
  const { getToken } = useToken();
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    const token = getToken();
   
    const fetchData = async () => {

        const url = `${BASE_URL}/order/list`;
        const response = await sendRequest(url, "GET", null, {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        });
        if(response){
          setOrders(response);
        }
    };
    fetchData();
  }, []);

  const handleCleanForm = () => {
    setFiltered([]);
    setFilterMessage(false);
    setValue("value", "");
  };
  const validations = {
    required: {
      value: true,
      message: "Campo requerido",
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
      selector: (row) => (row.state === 0 ? "En proceso" : "Cerrada"),
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
      selector: (row) => (row.state == 0 ? "En proceso" : "Cerrada"),
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
    setFilterMessage(false);
    let resultFilter = [];
    if (data.filter) {
      resultFilter = orders.filter((order) => {
        if (
          order[data.filter].toLowerCase().includes(data.value.toLowerCase())
        ) {
          return order;
        }
      });
    }
    if (resultFilter.length === 0) {
      setFilterMessage("No se encontraron resultados");
    }
    setFiltered(resultFilter);
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
              {filterMessage && <Error error={filterMessage} />}
              {errors && errors.value && (
                <p className="my-1">{errors.value.message}</p>
              )}
              {!isLoading && (
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

            {!isLoading && orders.length > 0 
            ? (
              <DataTable
                columns={columns}
                data={filtered.length > 0 ? filtered : orders}
                pagination
              />
            ):
            <p className="text-center">No hay órdenes</p>}
          </div>
        </div>
      </Main>
    </>
  );
};
