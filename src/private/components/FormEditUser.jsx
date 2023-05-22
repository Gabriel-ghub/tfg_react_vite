import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";
import { BASE_URL } from "../../api/api";
import { useToken } from "../../hooks/useToken";
import useHttp from "../../hooks/useHttp";
import { Loader } from "../../components/Loader";
import { Error } from "../../components/Error";
import { Link, useNavigate } from "react-router-dom";
import { ConfirmationModal } from "../../components/ConfirmationModal";

export const FormEditUser = ({ user, courses }) => {
  const { name, surname, email, id } = user;
  const { getToken } = useToken();
  const navigate = useNavigate();
  const { sendRequest, isLoading, error, clearError } = useHttp();
  const [successMessage, setSuccessMessage] = useState(false);
  const options = courses.map((course) => {
    return { value: course.id, label: `${course.name} ${course.year}` };
  });
  const initialCourse = options.find(
    (option) => option.value === user.course_id
  );
  const [showModal, setShowModal] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    getValues,
    reset,
  } = useForm({
    defaultValues: { ...user },
  });

  useEffect(() => {
    setValue("course_id", user.course_id);
  }, []);

  const onSubmit = async (data) => {
    setSuccessMessage(false);
    const url_update_user = `${BASE_URL}/user`;
    const token = getToken();
    const body = {
      name: data.name.trim(),
      surname: data.surname.trim(),
      email: data.email.trim(),
      course_id: data.course_id,
      id: id,
    };
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    const response = await sendRequest(
      url_update_user,
      "PUT",
      JSON.stringify(body),
      headers
    );
    if (response) {
      setSuccessMessage(response.message);
    }
  };

  const deleteStudent = async () => {
    const url_delete_user = `${BASE_URL}/user/${id}`;
    const token = getToken();
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    const response = await sendRequest(
      url_delete_user,
      "DELETE",
      null,
      headers
    );
    if (response) {
      setSuccessMessage(response.message);
      setShowModal(false);
      setTimeout(() => {
        navigate("/students");
      },1500)
    } else {
      setShowModal(false);
    }
  };
  return (
    <>
      <Link to={"/students"} className="btn btn-primary">
        Volver
      </Link>
      <div className="row mt-5 shadow-lg rounded py-5">
        <div className="col-12 d-flex justify-content-center">
          <form className="col-6" onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="" className="form-label">
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
            {error && error.name && <Error error={error.name[0]} />}
            <label htmlFor="" className="form-label">
              Apellido
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
                  value: 2,
                  message: "El apellido debe tener al menos 2 caracteres",
                },
                maxLength: {
                  value: 50,
                  message: "El apellido debe tener menos de 50 caracteres",
                },
              })}
            />
            {error && error.surname && <Error error={error.surname[0]} />}
            <label htmlFor="" className="form-label">
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
                  value: 2,
                  message: "El email debe tener al menos 2 caracteres",
                },
                maxLength: {
                  value: 50,
                  message: "El email debe tener menos de 50 caracteres",
                },
                pattern: {
                  value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                  message: "El email debe ser válido",
                },
              })}
            />
            {error && error.email && <Error error={error.email[0]} />}
            <label htmlFor="" className="form-label">
              Curso
            </label>
            <Select
              options={options}
              defaultValue={initialCourse}
              onChange={(data) => setValue("course_id", data.value)}
            />
            {successMessage && (
              <div className="alert alert-info mt-2" role="alert">
                {successMessage}
              </div>
            )}
            <div className="col-12 text-center">
              {isLoading ? (
                <Loader />
              ) : (
                <>
                  <div className="d-flex gap-3 justify-content-center">
                    <button type="submit" className="btn btn-primary mt-3">
                      Guardar
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        return setShowModal(true);
                      }}
                      type="submit"
                      className="btn btn-danger text-white mt-3"
                    >
                      Borrar
                    </button>
                  </div>
                </>
              )}
            </div>
            <ConfirmationModal
              show={showModal}
              message="¿Estás seguro que deseas borrar al alumno?"
              onConfirm={() => deleteStudent(id)}
              onCancel={() => setShowModal(false)}
            />
          </form>
        </div>
      </div>
    </>
  );
};
