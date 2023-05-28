import { Loader } from "../../components/Loader";
import { BASE_URL } from "../../api/api";
import useHttp from "../../hooks/useHttp";
import { Error } from "../../components/Error";
import { useForm } from "react-hook-form";


const url_create_car = `${BASE_URL}/car/create`;

export const FormCreateCar = ({ setCarFound }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { isLoading, sendRequest, error, clearError } = useHttp();

  const onSubmit = async (data) => {
    const token = JSON.parse(localStorage.getItem("token"));

    const car = {
      plate: data.plate.trim(),
      brand: data.brand.trim(),
      model: data.model.trim(),
    };
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    const body = JSON.stringify(car);
    const response = await sendRequest(url_create_car, "POST", body, headers);

    if (response) {
      const newCar = {
        plate: response.car.plate,
        model: response.car.model,
        brand: response.car.brand,
        id: response.car.id,
      };
      setCarFound(newCar);
    } else {
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="col-8 mx-auto">
        <h4>No existen coincidencias.</h4>
        <h4>¿Quiere crear un nuevo coche?</h4>
        <div className="form-group">
          <label htmlFor="formGroupExampleInput">Matrícula</label>
          <input
            type="text"
            {...register("plate", {
              required: {
                value: true,
                message: "Campo requerido.",
              },
              minLength: {
                value: 6,
                message: "La matrícula debe tener mínimo 6 caracteres.",
              },
              maxLength: {
                value: 11,
                message: "La matrícula debe tener máximo 11 caracteres.",
              },
            })}
            className="form-control mb-2"
          />
          {errors && errors.plate && <Error error={errors.plate.message} />}
          {error && error.plate && (
            <Error error={error.plate} clearError={clearError} />
          )}
        </div>
        <div className="form-group">
          <label htmlFor="formGroupExampleInput2">Marca</label>
          <input
            type="text"
            className="form-control mb-2"
            {...register("brand", {
              required: { value: true, message: "Campo requerido." },
              minLength: {
                value: 1,
                message: "La marca debe tener mínimo 1 caracteres.",
              },
              maxLength: {
                value: 25,
                message: "La marca debe tener máximo 25 caracteres.",
              },
            })}
          />
          {errors && errors.brand && <Error error={errors.brand.message} />}
          {error && error.brand && (
            <Error error={error.brand} clearError={clearError} />
          )}
        </div>
        <div className="form-group">
          <label htmlFor="formGroupExampleInput2">Modelo</label>
          <input
            type="text"
            className="form-control"
            {...register("model", {
              required: { value: true, message: "Campo requerido." },
              minLength: {
                value: 1,
                message: "El modelo debe tener mínimo 1 caracter.",
              },
              maxLength: {
                value: 25,
                message: "El modelo debe tener máximo 25 caracteres.",
              },
            })}
          />
        </div>
        {errors && errors.model && <Error error={errors.model.message} />}
        {error && error.model && (
          <Error error={error.model} clearError={clearError} />
        )}
        {isLoading ? (
          <Loader></Loader>
        ) : (
          <button className="btn btn-primary mx-auto mt-3">Crear coche</button>
        )}
      </form>
    </>
  );
};
