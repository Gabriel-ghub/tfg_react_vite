import React, { useState } from "react";
import { useToken } from "../../hooks/useToken";
import useHttp from "../../hooks/useHttp";
import { useForm } from "react-hook-form";
import { BASE_URL } from "../../api/api";
import { Loader } from "../../components/Loader";
import { Error } from "../../components/Error";
import { SuccessMessage } from "../../components/SuccessMessage";
export const FormEditAdmin = () => {
  const { getToken } = useToken();
  const { sendRequest, isLoading, error, clearError } = useHttp();
  const [successMessaje, setSuccessMessaje] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    if (data.password1 !== data.password2) {
      setError("password1", {
        type: "custom",
        message: "Las contraseñas no coinciden.",
      });
      setError("password2", {
        type: "custom",
        message: "Las contraseñas no coinciden.",
      });
      return;
    } else {
      clearError("password2");
      clearError("password1");
    }
    const token = getToken();
    const url = `${BASE_URL}/user/changePassword`;
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    const response = await sendRequest(
      url,
      "PUT",
      JSON.stringify(data),
      headers
    );
    if (response) {
      setSuccessMessaje("Contraseña actualizada correctamente.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="col-12 col-md-4 gap-2  text-start"
    >
      <div className="form-group">
        <label className="form-label" htmlFor="password_actual">
          Contraseña actual
        </label>
        <input
          type="password"
          className="form-control"
          id="password_actual"
          {...register("current_password", {
            required: {
              value: true,
              message: "Campo requerido.",
            },
            minLength: {
              value: 6,
              message: "Debe tener al menos 6 caracteres.",
            },
            maxLength: {
              value: 15,
              message: "Debe tener menos de 15 caracteres.",
            },
          })}
        />
        {errors &&
          errors.current_password &&
          errors.current_password.message && (
            <Error error={errors.current_password.message} />
          )}
        {error && error.current_password && error.current_password && (
          <Error error={error.current_password} clearError={clearError} />
        )}
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="name">
          Nueva contraseña
        </label>
        <input
          type="password"
          className="form-control"
          id="name"
          {...register("password1", {
            required: {
              value: true,
              message: "Campo requerido.",
            },
            minLength: {
              value: 6,
              message: "Debe tener al menos 6 caracteres.",
            },
            maxLength: {
              value: 15,
              message: "Debe tener menos de 15 caracteres.",
            },
          })}
        />
        {errors && errors.password1 && errors.password1.message && (
          <Error error={errors.password1.message} />
        )}
        {error && error.password1 && error.password1 && (
          <Error error={error.password1} clearError={clearError} />
        )}
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="password">
          Repetir contraseña
        </label>
        <input
          type="password"
          className="form-control"
          id="password"
          {...register("password2", {
            required: {
              value: true,
              message: "Campo requerido.",
            },
            minLength: {
              value: 6,
              message: "Debe tener al menos 6 caracteres.",
            },
            maxLength: {
              value: 15,
              message: "Debe tener menos de 15 caracteres.",
            },
          })}
        />
        {errors && errors.password2 && errors.password2.message && (
          <Error error={errors.password2.message} />
        )}
        {error && error.password2 && error.password2 && (
          <Error error={error.password2} clearError={clearError} />
        )}
      </div>
      {successMessaje && <SuccessMessage message={successMessaje} />}
      <div className="col-12">
        {isLoading ? (
          <Loader />
        ) : (
          <div className="col-12 d-flex justify-content-center mt-2">
            <button className="btn btn-primary">Guardar</button>
          </div>
        )}
      </div>
    </form>
  );
};
