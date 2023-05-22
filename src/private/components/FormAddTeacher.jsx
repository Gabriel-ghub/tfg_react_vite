import React from "react";
import { useToken } from "../../hooks/useToken";
import { useForm } from "../../hooks/useForm";
import { BASE_URL } from "../../api/api";
import useHttp from "../../hooks/useHttp";
import { Loader } from "../../components/Loader";
import { useNavigate } from "react-router-dom";
import { Error } from "../../components/Error";

const initialForm = {
  name: "",
  surname: "",
  email: "",
  password: "",
};
export const FormAddTeacher = () => {
  const navigate = useNavigate();
  const { getToken } = useToken();
  const {
    username,
    email,
    name,
    surname,
    password,
    setFormState,
    onInputChange,
    onResetForm,
  } = useForm(initialForm);
  const { sendRequest, isLoading, error, clearError } = useHttp();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name == "" || surname == "" || email == "") {
      return false;
    }
    const token = getToken();
    const url = `${BASE_URL}/user/createTeacher`;
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    const data = {
      name,
      surname,
      email,
      password,
    };
    const body = JSON.stringify(data);
    const response = await sendRequest(url, "POST", body, headers);
    if (response) {
      onResetForm();
      navigate("/teachers");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="form-label text-start">Datos del profesor</h3>
      <div className="row mt-2">
        <div className="col-12 col-md-6">
          <label htmlFor="name" className="form-label">
            Nombre/s*
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={name}
            name="name"
            onChange={onInputChange}
          />
          {error && error.name && <Error error={error.name} clearError={clearError} />}
        </div>

        <div className="col-12 col-md-6">
          <label htmlFor="surname" className="form-label">
            Apellido/s*
          </label>
          <input
            type="text"
            className="form-control"
            id="surname"
            value={surname}
            name="surname"
            onChange={onInputChange}
          />
          {error && error.surname && <Error error={error.surname} clearError={clearError} />}

        </div>
      </div>
      <div className="row mt-3">
        <div className="col-12 col-md-6">
          <label htmlFor="name" className="form-label">
            Email*
          </label>
          <input
            type="email"
            className="form-control"
            id="name"
            name="email"
            onChange={onInputChange}
            value={email}
          />
          {error && error.email && <Error error={error.email} clearError={clearError} />}
        </div>
        <div className="col-12 col-md-6">
          <label htmlFor="name" className="form-label">
            Contraseña*
          </label>
          <input
            type="password"
            className="form-control"
            id="name"
            name="password"
            onChange={onInputChange}
            value={password}
          />
          {error && error.password && <Error error={error.password} clearError={clearError} />}
        </div>
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <div className="col-12 text-center mt-3">
          <button
            type="submit"
            className={
              name == "" || surname == "" || email == "" || username == ""
                ? "btn btn-primary mt-3 disabled"
                : "btn btn-primary mt-3 "
            }
          >
            Agregar
          </button>
        </div>

      )}
    </form>
  );
};
