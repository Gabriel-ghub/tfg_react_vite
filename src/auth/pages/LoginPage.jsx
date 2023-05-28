import React, { useContext } from "react";
import { Loader } from "../../components/Loader";
import { AuthContext } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import { Error } from "../../components/Error";

export const LoginPage = () => {
  const { onLogin, isLoading, error } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    onLogin(data.email, data.password);
  };

  return (
    <>
      <div className="container-fluid vh-100">
        <div className="row vh-100">
          <div className="col-sm-12 d-flex align-items-center justify-content-center bg-dark align-items-md-center text-white">
            <form
              className="col-12 col-sm-6 col-md-3"
              onSubmit={handleSubmit(onSubmit)}
            >
              <h1 className="mb-5 text-center">Automoción CSC</h1>
              {error && (
                <div className="d-flex justify-content-center alert alert-danger mt-1">
                  {error}
                </div>
              )}
              <div className="form-group">
                <label className="mb-1">Email</label>
                <input
                  className="form-control"
                  type="email"
                  id="email"
                  {...register("email", {
                    required: {
                      value: true,
                      message: "El email es requerido",
                    },
                  })}
                />
                {errors && errors.email && (
                  <Error error={errors.email.message} />
                )}
              </div>
              <div className="form-group mt-4">
                <label className="mb-1">Contraseña</label>
                <input
                  className="form-control"
                  type="password"
                  id="password"
                  {...register("password", {
                    required: {
                      value: true,
                      message: "La contraseña es requerida",
                    },
                    minLength: {
                      value: 6,
                      message: "La contraseña debe tener al menos 6 caracteres",
                    },
                  })}
                />
                {errors && errors.password && (
                  <Error error={errors.password.message} />
                )}
              </div>
              {!isLoading && (
                <div className="d-flex my-5 justify-content-center">
                  <button type="submit" className="btn btn-primary w-50">
                    Acceder
                  </button>
                </div>
              )}
              {isLoading && <Loader></Loader>}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
