import React, { useState } from "react";
import { Loader } from "../../components/Loader";
import useHttp from "../../hooks/useHttp";
import { useToken } from "../../hooks/useToken";
import { BASE_URL } from "../../api/api";
import { Error } from "../../components/Error";
import { validationType } from "../../validations/validator";
import { useForm } from "react-hook-form";


const url_create_course = `${BASE_URL}/courses`;
export const FormAddCourse = ({ courses, setCourses }) => {
  const [errorInput, setErrorInput] = useState("");
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
  const { getToken } = useToken();
  const onSubmit = async (data) => {
    const body = {
      name: data.name.trim(),
      year: data.year.trim(),
    };
    const token = getToken();
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const response = await sendRequest(
      url_create_course,
      "POST",
      JSON.stringify(body),
      headers
    );
    if (response) {
      setCourses([...courses, response]);
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="d-flex gap-2 col-12 col-md-6">
      <label className="form-label">Datos del curso</label>
      <label htmlFor="name" className="form-label">
        Nombre
      </label>
      <input
        type="text"
        className="form-control"
        {...register("name", {
          required: {
            value: true,
            message: "El nombre es requerido",
          },
          minLength: {
            value: 2,
            message: "El nombre debe tener al menos 2 caracteres",
          },
          maxLength: {
            value: 50,
            message: "El nombre debe tener menos de 50 caracteres",
          },
        })}
      />
      {errors && errors.name && <Error error={errors.name.message} />}
      {error && error.name && (
        <Error error={error.name} clearError={clearError} />
      )}
      <label htmlFor="year" className="form-label">
        Año
      </label>
      <input
        type="number"
        className="form-control"
        {...register("year", {
          required: {
            value: true,
            message: "El año es requerido",
          },
          minLength: {
            value: 2,
            message: "El año debe tener al menos 2 caracteres",
          },
          maxLength: {
            value: 5,
            message: "El año debe tener menos de 5 caracteres",
          },
        })}
      />
      {errors && errors.year && <Error error={errors.year.message} />}
      {error && error.year && (
        <Error error={error.year} clearError={clearError} />
      )}
      {isLoading && <Loader></Loader>}
      {!isLoading && (
        <div className="col-12 d-flex justify-content-center">
          <button type="submit" className="btn btn-primary mt-3">
            Agregar
          </button>
        </div>
      )}
      {errorInput && (
        <div
          className="alert alert-danger d-flex align-items-center justify-content-between w-100"
          role="alert"
        >
          <p className="p-0 m-0">{errorInput}</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-x-circle-fill"
            viewBox="0 0 16 16"
          >
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z" />
          </svg>
        </div>
      )}
    </form>
  );
}
