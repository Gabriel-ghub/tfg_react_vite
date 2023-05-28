import React, { useState } from "react";
import { useToken } from "../../hooks/useToken";
import { BASE_URL } from "../../api/api";
import useHttp from "../../hooks/useHttp";
import { Loader } from "../../components/Loader";
import { useNavigate } from "react-router-dom";
import { Error } from "../../components/Error";
import { useForm } from "react-hook-form";

export const FormAddTeacher = ({setTeachers}) => {
  const { getToken } = useToken();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    getValues,
    reset
  } = useForm();
  const { sendRequest, isLoading, error, clearError } = useHttp();
  const [successMessage, setSuccessMessage] = useState(false);

  const onSubmit = async (data) => {
    const token = getToken();
    const url = `${BASE_URL}/user/createTeacher`;
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    const body = {
      name: data.name.trim(),
      surname: data.surname.trim(),
      email: data.email.trim(),
      password: data.password.trim(),
    };

    const response = await sendRequest(
      url,
      "POST",
      JSON.stringify(body),
      headers
    );
    if (response) {
      setSuccessMessage(response.message)
      setTeachers(prev => [...prev, response.user])
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h3 className="form-label text-start">Datos del profesor</h3>
      <div className="row mt-2">
        <div className="col-12 col-md-6">
          <label htmlFor="name" className="form-label">
            Nombre/s*
          </label>
          <input
            type="text"
            className="form-control"
            {...register("name", {
              required: {
                value: true,
                message: "Campo requerido.",
              },
              minLength: {
                value: 3,
                message: "El nombre debe tener al menos 3 caracteres.",
              },
              maxLength: {
                value: 20,
                message: "El nombre debe tener menos de 20 caracteres.",
              },
            })}
          />
          {errors && errors.name && <Error error={errors.name.message} />}
          {error && error.name && (
            <Error error={error.name} clearError={clearError} />
          )}
        </div>

        <div className="col-12 col-md-6">
          <label htmlFor="surname" className="form-label">
            Apellido/s*
          </label>
          <input
            type="text"
            className="form-control"
            {...register("surname", {
              required: {
                value: true,
                message: "Campo requerido.",
              },
              minLength: {
                value: 3,
                message: "El apellido debe tener al menos 3 caracteres.",
              },
              maxLength: {
                value: 20,
                message: "El apellido debe tener menos de 20 caracteres.",
              },
            })}
          />
          {errors && errors.surname && <Error error={errors.surname.message} />}
          {error && error.surname && (
            <Error error={error.surname} clearError={clearError} />
          )}
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-12 col-md-6">
          <label htmlFor="name" className="form-label">
            Email*
          </label>
          <input
            type="text"
            className="form-control"
            {...register("email", {
              required: {
                value: true,
                message: "Campo requerido.",
              },
              minLength: {
                value: 3,
                message: "El email debe tener al menos 3 caracteres.",
              },
              maxLength: {
                value: 20,
                message: "El email debe tener menos de 20 caracteres.",
              },
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                message: "El email no es válido.",
              },
            })}
          />
          {errors && errors.email && <Error error={errors.email.message} />}
          {error && error.email && (
            <Error error={error.email} clearError={clearError} />
          )}
        </div>
        <div className="col-12 col-md-6">
          <label htmlFor="name" className="form-label">
            Contraseña*
          </label>
          <input
            type="password"
            className="form-control"
            {...register("password", {
              required: {
                value: true,
                message: "Campo requerido.",
              },
              minLength: {
                value: 6,
                message: "La contraseña debe tener al menos 6 caracteres.",
              },
              maxLength: {
                value: 16,
                message: "La contraseña debe tener máximo 16 caracteres.",
              },
            })}
          />
          {errors && errors.password && <Error error={errors.password.message} />}
          {error && error.password && (
            <Error error={error.password} clearError={clearError} />
          )}
        </div>
      </div>
      {successMessage && (
        <div className="alert alert-info" role="alert">
          {successMessage}
        </div>
      )}
      {isLoading ? (
        <Loader />
      ) : (
        <div className="col-12 text-center mt-3">
          <button type="submit" className={"btn btn-primary mt-3"}>
            Agregar
          </button>
        </div>
      )}
    </form>
  );
};
