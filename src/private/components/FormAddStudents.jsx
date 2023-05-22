import React, { useState } from "react";
import { SelectCourse } from "./SelectCourse";
import { useForm } from "react-hook-form";
import { BASE_URL } from "../../api/api";
import { useToken } from "../../hooks/useToken";
import useHttp from "../../hooks/useHttp";
import { Loader } from "../../components/Loader";
import uuid from "react-uuid";
import { validationType } from "../../validations/validator";
import { Error } from "../../components/Error";

export const FormAddStudents = ({ courses }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    getValues,
    reset,
  } = useForm();
  const [errorForm, setErrorForm] = useState(false);
  const [courseId, setCourseId] = useState(false);
  const { getToken } = useToken();
  const { isLoading, sendRequest, error, clearError } = useHttp();
  const [errorRequest, setErrorRequest] = useState([]);
  const [successRequest, setSuccessRequest] = useState(false);

  const onSubmit = async (data) => {
    setErrorForm(false);

    const url = `${BASE_URL}/user/createStudent`;
    const token = getToken();
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    const body = {
      name:data.name.trim(),
      surname: data.surname.trim(),
      email: data.email.trim(),
      course_id: courseId,
      role_id: 2,
    };
    const response = await sendRequest(
      url,
      "POST",
      JSON.stringify(body),
      headers
    );
    if (response) {
      setSuccessRequest(response.message);
      reset();
    }
  };



  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label className="form-label">Datos del alumno</label>
        <div className="row">
          <div className="col-12 col-md-6">
            <label htmlFor="name" className="form-label">
              Nombre/s
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
                  value: 3,
                  message: "El nombre debe tener al menos 3 caracteres",
                },
                maxLength: {
                  value: 30,
                  message: "El nombre debe tener menos de 30 caracteres",
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
              Apellido/s
            </label>
            <input
              type="text"
              className="form-control"
              {...register("surname", {
                required: {
                  value: true,
                  message: "El apellido es requerido",
                },
                minLength: {
                  value: 3,
                  message: "El apellido debe tener al menos 3 caracteres",
                },
                maxLength: {
                  value: 40,
                  message: "El apellido debe tener menos de 40 caracteres",
                },
              })}
            />
            {errors && errors.surname && (
              <Error error={errors.surname.message} />
            )}
            {error && error.surname && (
              <Error error={error.surname} clearError={clearError} />
            )}
          </div>
        </div>
        <div className="row">
          <div className="col-6">
            <label htmlFor="name" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              {...register("email", {
                required: {
                  value: true,
                  message: "El email es requerido",
                },
                minLength: {
                  value: 3,
                  message: "El email debe tener al menos 3 caracteres",
                },
                maxLength: {
                  value: 40,
                  message: "El email debe tener menos de 40 caracteres",
                },
                pattern: {
                  value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                  message: "El correo electrónico no es válido",
                },
              })}
            />
            {errors && errors.email && <Error error={errors.email.message} />}
            {error && error.email && (
              <Error error={error.email} clearError={clearError} />
            )}
          </div>
          <div className="col-6">
            <SelectCourse
              courses={courses}
              setCourseId={setCourseId}
            ></SelectCourse>
          </div>
        </div>
        {errorForm && (
          <div className="alert alert-warning" role="alert">
            {errorForm}
          </div>
        )}
        {errorRequest.map((err) => (
          <div key={uuid()} className="alert alert-danger" role="alert">
            {err}
          </div>
        ))}
        {successRequest && (
          <div key={uuid()} className="alert alert-info" role="alert">
            {successRequest}
          </div>
        )}
        {isLoading ? (
          <Loader />
        ) : (
          <div className="col-12 text-center">
            <button type="submit" className="btn btn-primary mt-3">
              Agregar
            </button>
          </div>
        )}
      </form>
    </>
  );
};
