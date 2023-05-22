import React, { useState } from "react";
import { Loader } from "../../components/Loader";
import useHttp from "../../hooks/useHttp";
import { useToken } from "../../hooks/useToken";
import { BASE_URL } from "../../api/api";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ConfirmationModal } from "../../components/ConfirmationModal";
import { Error } from "../../components/Error";


export const FormEditCourse = ({ course }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { id: course.id, name: course.name, year: course.year },
  });
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const { getToken } = useToken();
  const { isLoading, sendRequest, error } = useHttp();
  const navigate = useNavigate();

  const deleteCourse = async (id) => {
    e.preventDefault();
    const token = getToken();
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    const body = {
      id,
    };
    const response = await sendRequest(
      `${BASE_URL}/courses`,
      "DELETE",
      JSON.stringify(body),
      headers
    );
   if (response) {
     setSuccessMessage("Curso eliminado con éxito");
     setTimeout(() => {
       navigate(`/courses`);
     }, 1500);
   }
  };

  const onSubmit = async (data) => {
    const { id, name, year } = data;
    const token = getToken();
    const url = `${BASE_URL}/course/${id}/update`;
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    const body = {
      id,
      name: name,
      year: year,
    };

    const response = await sendRequest(
      url,
      "PUT",
      JSON.stringify(body),
      headers
    );
    if (response) {
      setSuccessMessage(response.message)
      setTimeout(() => {
        navigate(`/courses`);
      },1500)
    }
  };
  
  return (
    <>
      <form className="col-12 col-md-6" onSubmit={handleSubmit(onSubmit)}>
        <label className="form-label" htmlFor="name">
          Nombre
        </label>
        <input
          type="text"
          className="form-control border-success"
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
              value: 20,
              message: "El nombre debe tener menos de 20 caracteres",
            },
          })}
        />
        {errors && errors.name && <Error error={errors.name.message} />}
        {error && error.name && (
          <Error error={error.name} clearError={clearError} />
        )}
        <label className="form-label" htmlFor="year">
          Año
        </label>
        <input
          type="number"
          className="form-control border-success"
          {...register("year", {
            required: {
              value: true,
              message: "El año es requerido",
            },
            min: {
              value: 1,
              message: "El año debe ser mayor a 0",
            },
            max: {
              value: 3000,
              message: "El año debe ser menor a 3000",
            },
          })}
        />
        {errors && errors.year && <Error error={errors.year.message} />}
        {error && error.year && (
          <Error error={error.year} clearError={clearError} />
        )}
        {successMessage && (
          <div className="alert alert-success">{successMessage}</div>
        )}
        <div className="d-flex justify-content-center mt-3 gap-3">
          {isLoading || successMessage ? (
            <Loader />
          ) : (
            <div className="col-12 d-flex gap-2">
              <button className="btn btn-primary">Guardar</button>
              <button
                className="btn btn-danger text-white"
                onClick={(e) => {
                  e.preventDefault();
                  return setShowModal(true);
                }}
              >
                Borrar
              </button>
            </div>
          )}
          <ConfirmationModal
            show={showModal}
            message="¿Estás seguro que deseas borrar el curso?"
            onConfirm={() => deleteCourse(course.id)}
            onCancel={() => setShowModal(false)}
          />
        </div>
      </form>
    </>
  );
};
