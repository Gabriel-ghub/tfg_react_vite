import React, { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Loader } from "../../components/Loader";
import useHttp from "../../hooks/useHttp";
import { Main } from "../components/global/Main";
import DataTable from "react-data-table-component";
import Export from "react-data-table-component";
import { BASE_URL } from "../../api/api";
import { useToken } from "../../hooks/useToken";
// import { useForm } from "../../hooks/useForm";
import { Error } from "../../components/Error";
import { validationType } from "../../validations/validator";
import { useForm } from "react-hook-form";
import { CardOrder } from "../studentComponents/CardOrder";

export const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [mensaje, setMensaje] = useState(false);
  const { isLoading, sendRequest, clearError, error, setIsLoading } = useHttp();

  // const { plate, onInputChange, onResetForm } = useForm({
  //   plate: ""
  // })
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    getValues,
  } = useForm();
  const { getToken } = useToken();
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token"));
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

  // const handleChangePlate = (e) =>{
  //   if(!validationType["isSafe"](e.target.value) || !validationType["length"](e.target.value,11)){
  //     return false
  //   }
  //   onInputChange(e)
  // }

  // const handleSearchPlate = async (e) => {
  //   e.preventDefault();
  //   if (plate == "") return

  //   const url = `${BASE_URL}/order/${plate}`
  //   const token = getToken();
  //   const headers = {
  //     Authorization: `Bearer ${token}`
  //   }
  //   const response = await sendRequest(url, "GET", null, headers)
  //   if (response) {
  //     setCarOrders(response)
  //     onResetForm();
  //   } else {
  //     setCarOrders([])
  //   }
  // }

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
    setIsLoading(true);
    setMensaje(false);

    switch (data.filter) {
      case "plate":
        const filter_orders = orders.filter(
          (order) => order.plate === data.value
        );
        filter_orders.length === 0
          ? setMensaje("No se ha encontrado ningún resultado")
          : setFiltered(filter_orders);
        break;
      case "name":
        //filter orders where name to lower case contains data.value to lower case
        const filter_orders_name = orders.filter((order) =>
          order.name.toLowerCase().includes(data.value.toLowerCase())
        );
        filter_orders_name.length === 0
          ? setMensaje("No se ha encontrado ningún resultado")
          : setFiltered(filter_orders_name);
        break;
      case "surname":
        const filter_orders_surname = orders.filter(
          (order) => order.surname === data.value
        );
        filter_orders_surname.length === 0
          ? setMensaje("No se ha encontrado ningún resultado")
          : setFiltered(filter_orders_surname);
        break;
      default:
        setMensaje("No se ha encontrado ningún resultado");
        return setOrders(orders);
    }
    setIsLoading(false);
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
                  <option value="surnname">Apellido</option>
                </select>
              </div>

              {errors && errors.plate && (
                <p className="my-1">{errors.plate.message}</p>
              )}
              {/* {error && error.plate && <Error error={error.plate} clearError={clearError}/>} */}
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
            {isLoading ? (
              <Loader></Loader>
            ) : mensaje ? (
              <p>Error al cargar los datos</p>
            ) : orders.length === 0 ? (
              <p>No se encontraron resultados</p>
            ) : (
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
