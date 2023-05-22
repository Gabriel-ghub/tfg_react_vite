import { useContext, useState } from "react";
import { Loader } from "../../components/Loader";
import { CarContext } from "../context/CarContext/CarContext";
import { BASE_URL } from "../../api/api";
import useHttp from "../../hooks/useHttp";
import { validationType } from "../../validations/validator";
import { Error } from "../../components/Error";
import { useForm } from "react-hook-form";

const initialCar = {
  plate: "",
  brand: "",
  model: "",
};

const url_create_car = `${BASE_URL}/car/create`;

export const FormCreateCar = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    getValues,
  } = useForm();
  const { createNewCar } = useContext(CarContext);
  const { isLoading, sendRequest, error, clearError } = useHttp();

  const onSubmit = async (data) => {

    const token = JSON.parse(localStorage.getItem("token"));

    const car = {
      plate: data.plate.trim(),
      brand: data.brand.trim(),
      model: data.model.trim(),
    };
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    const body = JSON.stringify(car);
    const response = await sendRequest(url_create_car, "POST", body, headers);

    if (response) {
      const newCar = {
        plate: response.car.plate,
        model: response.car.model,
        brand: response.car.brand,
        id: response.car.id,
      };
      createNewCar(newCar);
    } else {
    }
  };


  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="col-8 mx-auto">
        <h3>No existen coincidencias.</h3>
        <h3>¿Quiere crear un nuevo coche?</h3>
        <div className="form-group">
          <label htmlFor="formGroupExampleInput">Matrícula</label>
          <input
            type="text"
            {...register("plate", {
              required: { value: true, message: "La matrícula es obligatoria" },
              minLength: {
                value: 6,
                message: "La matrícula debe tener minimo 6 caracteres",
              },
              maxLength: {
                value: 11,
                message: "La matrícula debe tener maximo 11 caracteres",
              },
            })}
            className="form-control"
          />
          {errors && errors.plate && <Error error={errors.plate.message} />}
          {error && error.plate && (
            <Error error={error.plate} clearError={clearError} />
          )}
        </div>
        <div className="form-group">
          <label htmlFor="formGroupExampleInput2">Marca</label>
          <input
            type="text"
            className="form-control"
            {...register("brand", {
              required: { value: true, message: "La marca es obligatoria" },
              minLength: {
                value: 1,
                message: "La marca debe tener minimo 1 caracteres",
              },
              maxLength: {
                value: 25,
                message: "La marca debe tener maximo 25 caracteres",
              },
            })}
          />
          {errors && errors.brand && <Error error={errors.brand.message} />}
          {error && error.brand && (
            <Error error={error.brand} clearError={clearError} />
          )}
        </div>
        <div className="form-group">
          <label htmlFor="formGroupExampleInput2">Modelo</label>
          <input
            type="text"
            className="form-control"
            {...register("model", {
              required: { value: true, message: "El modelo es obligatoria" },
              minLength: {
                value: 1,
                message: "La modelo debe tener minimo 1 caracter",
              },
              maxLength: {
                value: 25,
                message: "El modelo debe tener maximo 25 caracteres",
              },
            })}
          />
        </div>
        {errors && errors.model && <Error error={errors.model.message} />}
        {error && error.model && (
          <Error error={error.model} clearError={clearError} />
        )}
        {isLoading ? (
          <Loader></Loader>
        ) : (
          <button className="btn btn-primary mx-auto mt-3">Crear coche</button>
        )}
      </form>
    </>
  );
};
