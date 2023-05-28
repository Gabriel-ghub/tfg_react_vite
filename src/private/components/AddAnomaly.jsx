import useHttp from "../../hooks/useHttp";
import { useForm } from "react-hook-form";
import { Error } from "../../components/Error";
import { useToken } from "../../hooks/useToken";
import { BASE_URL } from "../../api/api";
import { Loader } from "../../components/Loader";

export const AddAnomaly = ({ order, setAnomalies, setFormDataAnomalies }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setError
  } = useForm();
  const { sendRequest, isLoading, error, clearError } = useHttp();
  const { getToken } = useToken();
  const url_anomaly = `${BASE_URL}/anomaly/createOne`;

  const onAddAnomaly = async (data) => {
    if(data.description.trim().length === 0){
      setError("description", {type: "custom", message: "Este campo puede estar vacío."})
      return;
    }
    const body = {
      description: data.description,
      order_id: order,
    };
    const token = getToken();
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    const response = await sendRequest(
      url_anomaly,
      "POST",
      JSON.stringify(body),
      headers
    );
    if (response) {
      setAnomalies((prev) => [...prev, response]);
      setFormDataAnomalies((prev) => [...prev, response]);
      reset();
    }
  };

  return (
    <form className="d-flex flex-column" onSubmit={handleSubmit(onAddAnomaly)}>
      <div className="form-group">
        <label className="required-field h5 mb-3">Agregar anomalías</label>
        <input
          className="form-control"
          type="text"
          placeholder="Ruido en la rueda derecha"
          {...register("description", {
            required: {
              value: true,
              message: "Campo requerido.",
            },
            minLength: {
              value: 3,
              message: "Debe tener al menos 5 caracteres.",
            },
          })}
        />
        {error && error.description && (
          <Error error={error.description} clearError={clearError} />
        )}
        {errors && errors.description && errors.description.message && (
          <Error error={errors.description.message} />
        )}
      </div>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="col-12 d-flex justify-content-center">
          <button className="btn" type="submit">
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
        </div>
      )}
    </form>
  );
};
