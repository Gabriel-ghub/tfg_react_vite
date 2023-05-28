import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Loader } from "../../components/Loader";
import useHttp from "../../hooks/useHttp";
import { useForm } from "react-hook-form";
import { useToken } from "../../hooks/useToken";
import { BASE_URL } from "../../api/api";
import { Main } from "../components/global/Main";
import { Error } from "../../components/Error";
import { ConfirmationModal } from "../../components/ConfirmationModal";
import { SuccessMessage } from "../../components/SuccessMessage";

export const CarDetails = () => {
  const navigate = useNavigate();
  const { car_id } = useParams();
  const { isLoading, sendRequest, error, clearError } = useHttp();
  const { getToken } = useToken();
  const [car, setCar] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [changePlate, SetChangePlate] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    getValues,
    reset,
    clearErrors,
  } = useForm({
    defaultValues: async () => {
      const url_car = `${BASE_URL}/car/${car_id}`;
      const token = getToken();
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const response = await sendRequest(url_car, "GET", null, headers);
      if (response) {
        setCar(response);
        return response;
      } else {
        navigate("/cars");
      }
    },
  });

  const onSubmit = async (data) => {
    setSuccessMessage(false);
    const token = getToken();
    const body = {
      plate: data.plate.trim().toUpperCase(),
      brand: data.brand.trim(),
      model: data.model.trim(),
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    if (changePlate) {
      const url_update_car = `${BASE_URL}/car/${car_id}`;
      const response = await sendRequest(
        url_update_car,
        "PUT",
        JSON.stringify(body),
        headers
      );
      if (response) {
        setCar(response);
        setSuccessMessage("Actualizado correctamente");
      }
    } else {
      const url_update_car = `${BASE_URL}/car/${car_id}/update`;
      const token = getToken();
      const body = {
        brand: data.brand.trim(),
        model: data.model.trim(),
      };
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const response = await sendRequest(
        url_update_car,
        "PUT",
        JSON.stringify(body),
        headers
      );
      if (response) {
        setCar(response);
        setSuccessMessage("Actualizado correctamente");
      }
    }
  };

  const deleteCar = async () => {
    const url_delete_car = `${BASE_URL}/car/${car_id}`;
    const token = getToken();
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    const response = await sendRequest(url_delete_car, "DELETE", null, headers);
    if (response) {
      setSuccessMessage("Eliminado correctamente");
      setTimeout(() => {
        navigate("/cars");
      }, 2000);
    }
    setShowModal(false);
  };

  const handleChangePlate = () => {
    if(changePlate){
        clearErrors("plate");
    }
    SetChangePlate(!changePlate);
  }

  return (
    <Main page={"car_details_page"}>
      <Link to="/cars" className="btn btn-primary">
        Volver
      </Link>
      <div className="row mt-5">
        {isLoading && <Loader />}
        {car && (
          <>
            <h2 className="text-center">Detalles del coche</h2>
            <div className="col-12 shadow-lg rounded p-4 d-flex justify-content-center">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="col-12 col-md-6 gap-2"
              >
                {changePlate && (
                  <>
                    <label htmlFor="">Matricula</label>
                    <input
                      className="form-control"
                      type="text"
                      {...register("plate", {
                        required: {
                          value: true,
                          message: "Este campo es requerido",
                        },
                        maxLength: {
                          value: 10,
                          message:
                            "La matricula debe tener 10 caracteres maximo",
                        },
                      })}
                      maxLength="10"
                    />
                  </>
                )}

                <div className="d-flex flex-column align-items-start">
                  <label htmlFor="">Cambiar la matrícula</label>
                  <input
                    type="checkbox"
                    className="form-check-input"
                    onChange={() => handleChangePlate()}
                  />
                </div>
                {error && error.plate && (
                  <Error error={error.plate} clearError={clearError} />
                )}
                {errors && errors.plate && errors.plate.message && (
                  <Error error={errors.plate.message} />
                )}

                <label htmlFor="">Marca</label>
                <input
                  className="form-control"
                  type="text"
                  {...register("brand", {
                    required: {
                      value: true,
                      message: "Este campo es requerido",
                    },
                    maxLength: {
                      value: 25,
                      message: "La marca debe tener 25 caracteres maximo",
                    },
                  })}
                />
                {error && error.brand && (
                  <Error error={error.brand} clearError={clearError} />
                )}
                {errors && errors.brand && errors.brand.message && (
                  <Error error={errors.brand.message} />
                )}

                <label htmlFor="">Modelo</label>
                <input
                  className="form-control"
                  type="text"
                  {...register("model", {
                    required: {
                      value: true,
                      message: "Este campo es requerido",
                    },
                    maxLength: {
                      value: 25,
                      message: "El modelo debe tener 25 caracteres maximo",
                    },
                  })}
                  maxLength="25"
                />
                {error && error.model && error.model && (
                  <Error error={error.model} clearError={clearError} />
                )}
                {errors && errors.model && errors.model.message && (
                  <Error error={errors.model.message} />
                )}
                <div className="col-12 mt-3">
                  {successMessage && (
                    <SuccessMessage message={successMessage} />
                  )}
                  {isLoading && <Loader />}
                  {!isLoading && (
                    <div className="d-flex gap-2">
                      <button className="btn btn-primary">Actualizar</button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          return setShowModal(true);
                        }}
                        type="submit"
                        className="btn btn-danger text-white"
                      >
                        Borrar
                      </button>
                    </div>
                  )}
                </div>
              </form>
            </div>
            <ConfirmationModal
              show={showModal}
              message="¿Estás seguro que deseas borrar al alumno?"
              onConfirm={() => deleteCar(car_id)}
              onCancel={() => setShowModal(false)}
            />
          </>
        )}
      </div>
    </Main>
  );
};
