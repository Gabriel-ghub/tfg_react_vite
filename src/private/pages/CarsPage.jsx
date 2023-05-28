import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useHttp from "../../hooks/useHttp";
import { useForm } from "react-hook-form";
import { useToken } from "../../hooks/useToken";
import { BASE_URL } from "../../api/api";
import { Loader } from "../../components/Loader";
import { Main } from "../components/global/Main";
import { Error } from "../../components/Error";
import DataTable from "react-data-table-component";

export const CarsPage = () => {
  const { isLoading, sendRequest, error, clearError } = useHttp();
  const { getToken } = useToken();
  const [cars, setCars] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filterMessage, setFilterMessage] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors
  } = useForm({});

  const columns = [
    {
      name: "Matrícula",
      selector: (row) => row.plate,
      sortable: true,
    },
    {
      name: "Marca",
      selector: (row) => row.brand,
      sortable: true,
    },
    {
      name: "Modelo",
      selector: (row) => row.model,
      sortable: true,
    },
    {
      name: "",
      selector: (row) => {
        return (
          <Link className="btn btn-warning" to={`/car/${row.id}/details`}>
            Editar
          </Link>
        );
      },
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const url = `${BASE_URL}/cars`;
      const token = getToken();
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      const response = await sendRequest(url, "GET", null, headers);
      if (response) {
        setCars(response);
      }
    };
    fetchData();
  }, []);

  const onSubmit = (data) => {
    setFilterMessage(false);
    const result_filter = cars.filter((car) => {
      return car.plate === data.value;
    });
    if (result_filter.length > 0) {
      setFiltered(result_filter);
    }else{
      setFilterMessage("No se han encontrado coincidencias");
    }
  };

  const handleCleanForm = (e) =>{
    clearErrors();
    setFiltered([]);
    setFilterMessage(false);
    setValue("value", "");
  }
  return (
    <Main title="Vehículos">
      {isLoading && <Loader />}
      <div className="row mt-5">
        <h2 className="text-center">Coches registrados</h2>
        <div className="col-12 shadow-lg p-4 rounded">
          <form onSubmit={handleSubmit(onSubmit)} className="col-6">
            <label htmlFor="" className="form-label">
              Matricula
            </label>
            <input
              type="text"
              maxLength="12"
              {...register("value", {
                required: {
                  value: true,
                  message: "Campo requerido",
                },
                minLength: { value: 6, message: "Mínimo 6 caracteres" },
                maxLength: { value: 12, message: "Máximo 12 caracteres" },
              })}
              className="form-control"
            />
            {errors && errors.value && errors.value.message && (
              <Error error={errors.value.message} />
            )}
            {filterMessage && <Error error={filterMessage} />}
            <div className="col-12 d-flex gap-2">
              <button className="btn btn-primary mt-2">Buscar</button>
              <button type="reset"
                className="btn btn-warning mt-2"
                onClick={handleCleanForm}
              >
                Limpiar
              </button>
            </div>
          </form>
          {!isLoading && cars.length < 1 && <p>No hay coches registrados</p>}
          {!isLoading && cars.length > 0 && (
            <DataTable columns={columns} data={cars} pagination />
          )}
        </div>
      </div>
    </Main>
  );
};
