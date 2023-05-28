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
  const { id } = user;
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
      // email: data.email.trim(),
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
      setTimeout(() => {
        setSuccessMessage(false);
      }, 2000);
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
      }, 1500);
    } else {
      setShowModal(false);
    }
  };
  return (
    <>
      <Link to={"/students"} className="btn btn-primary">
        Volver
      </Link>
      <div className="row mt-5">
        <h3 className="text-center">Editar datos del alumno</h3>
        <div className="col-12 shadow-lg p-4 d-flex justify-content-center">
          <form className="col-12 col-md-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group mb-2">
              <label htmlFor="" className="form-label">
                Nombre
              </label>
              <input
                type="text"
                maxLength="50"
                className="form-control"
                {...register("name", {
                  required: {
                    value: true,
                    message: "Campo requerido.",
                  },
                  minLength: {
                    value: 2,
                    message: "El nombre debe tener al menos 2 caracteres.",
                  },
                  maxLength: {
                    value: 50,
                    message: "El nombre debe tener menos de 50 caracteres.",
                  },
                })}
              />
              {error && error.name && <Error error={error.name[0]} />}
              {errors && errors.name && errors.name.message && (
                <Error error={errors.name.message} />
              )}
            </div>
            <div className="form-group mb-2">
              <label htmlFor="" className="form-label">
                Apellido
              </label>
              <input
                type="text"
                maxLength="50"
                className="form-control"
                {...register("surname", {
                  required: {
                    value: true,
                    message: "Campo requerido.",
                  },
                  minLength: {
                    value: 2,
                    message: "El apellido debe tener al menos 2 caracteres.",
                  },
                  maxLength: {
                    value: 50,
                    message: "El apellido debe tener menos de 50 caracteres.",
                  },
                })}
              />
              {error && error.surname && <Error error={error.surname[0]} />}
              {errors && errors.surname && errors.surname.message && (
                <Error error={errors.surname.message} />
              )}
            </div>
            <div className="form-group mb-2">
              <label htmlFor="" className="form-label">
                Email
              </label>
              {/* <input
              type="email"
              maxLength="50"
              className="form-control"
              {...register("email", {
                required: {
                  value: true,
                  message: "Campo requerido",
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
            /> */}
              <div
                className="form-control"
                style={{ backgroundColor: "#e9ecef" }}
              >
                {getValues("email")}
              </div>
            </div>
            {/* {error && error.email && <Error error={error.email[0]} />} */}
            <div className="form-group mb-2">
              <label htmlFor="" className="form-label">
                Curso
              </label>
              <Select
                options={options}
                defaultValue={initialCourse}
                onChange={(data) => setValue("course_id", data.value)}
              />
            </div>
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
              message="¿Está seguro que desea borrar al alumno?"
              onConfirm={() => deleteStudent(id)}
              onCancel={() => setShowModal(false)}
            />
          </form>
        </div>
      </div>
    </>
  );
};
