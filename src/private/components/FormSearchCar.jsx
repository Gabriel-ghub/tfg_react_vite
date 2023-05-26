import React, { useContext } from "react";
import { CarContext } from "../context/CarContext/CarContext";
import { useForm } from "react-hook-form";
import { Error } from "../../components/Error";
export const FormSearchCar = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const { getCarInfo, isLoading } = useContext(CarContext);


  const onSubmit = (data) => {
    getCarInfo(data.plate);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="align-items-center justify-content-center col-8 mx-auto"
      >
        <div className="form-group d-flex flex-column col-12 text-center">
          <label htmlFor="lastName">
            <h3>Introduce la matrícula</h3>
          </label>
          <input
            className="form-control mt-3 text-center"
            type="text"
            {...register("plate", {
              required: { value: true, message: "Debe ingresar una matrícula" },
              maxLength: {
                value: 11,
                message: "Máximo 11 caracteres",
              },
              pattern: {
                value: /^[a-zA-Z0-9]+$/,
                message: "Solo se permiten letras y números sin espacios",
              },
            })}
          />
          {errors && errors.plate && <Error error={errors.plate.message} />}
          {!isLoading && (
            <button
              type="submit"
              className="btn btn-primary mx-auto mt-3"
            >
              Buscar
            </button>
          )}
        </div>
      </form>
    </>
  );
};
