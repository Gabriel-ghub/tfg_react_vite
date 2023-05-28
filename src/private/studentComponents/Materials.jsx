import { useEffect } from "react";
import useHttp from "../../hooks/useHttp";
import { useForm } from "react-hook-form";
import { Error } from "../../components/Error";
import { Loader } from "../../components/Loader";
import { useToken } from "../../hooks/useToken";
import { BASE_URL } from "../../api/api";
export const Materials = ({ order_id, setMaterials }) => {
  const { isLoading, sendRequest, error, clearError } = useHttp();
  const {
    formState: { errors },
    register,
    handleSubmit,
    reset,
  } = useForm();
  const { getToken } = useToken();

  const onSubmit = async (data) => {
    const body = {
      description: data.material,
      quantity: data.quantity,
      order_id,
    };
    const urlAddMaterial = `${BASE_URL}/material`;
    const token = getToken();
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const response = await sendRequest(
      urlAddMaterial,
      "POST",
      JSON.stringify(body),
      headers
    );
    if (response) {
      reset();
      setMaterials(response);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="d-flex align-items-center gap-3">
        <div className="w-75 d-flex align-items-center">
          <label htmlFor="">Descripción:</label>
          <input
            placeholder="Ejemplo:Aceite repsol 5L"
            type="text"
            {...register("material", {
              required: {
                value: true,
                message: "Debe ingresar una descripción",
              },
              maxLength: {
                value: 50,
                message: "La descripción no puede superar los 50 caracteres",
              },
            })}
            className="form-control"
          />
        </div>
        <div className="d-flex align-items-center">
          <label htmlFor="">Cantidad:</label>
          <input
            type="number"
            {...register("quantity", {
              required: {
                value: true,
                message: "Debe ingresar una cantidad",
              },
              max: {
                value: 100,
                message: "La cantidad no puede ser mayor a 100",
              },
            })}
            className="form-control"
          />
        </div>
        {isLoading ? (
          <Loader />
        ) : (
          <button type="submit" className="btn">
            <svg
              className="cursor-pointer"
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              fill="#027373"
              viewBox="0 0 16 16"
            >
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
            </svg>
          </button>
        )}
      </div>
      {errors && errors.material && errors.material.message && (
        <Error error={errors.material.message} />
      )}
      {errors && errors.quantity && errors.quantity.message && (
        <Error error={errors.quantity.message} />
      )}
    </form>
  );
};
