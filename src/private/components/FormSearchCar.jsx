import { useForm } from "react-hook-form";
import { Error } from "../../components/Error";
import useHttp from "../../hooks/useHttp";
import { BASE_URL } from "../../api/api";
import { useToken } from "../../hooks/useToken";
import { Loader } from "../../components/Loader";


export const FormSearchCar = ({setCarFound}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const { getToken } = useToken();
  const { sendRequest, isLoading, error } = useHttp();
  const getCarInfo = async (data) => {
    const matricula = data.plate;
    const token = getToken();
    const url = `${BASE_URL}/car/search?plate=${matricula}`;
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    const response = await sendRequest(url, "GET", null, headers);
    if (response) {
      const car = {
        id: response.id,
        plate: response.plate,
        brand: response.brand,
        model: response.model,
      }
      setCarFound(car);
    } else {
      setCarFound(null);
    }
  };



  return (
    <>
      <form
        onSubmit={handleSubmit(getCarInfo)}
        className="align-items-center justify-content-center col-8 mx-auto"
      >
        <div className="form-group d-flex flex-column col-12 text-center">
          <label htmlFor="lastName">
            <h3>Introduce la matrícula</h3>
          </label>
          <input
            className="form-control mt-3 text-center"
            type="text"
            maxLength="11"
            {...register("plate", {
              required: { value: true, message: "Debe ingresar una matrícula" },
              maxLength: {
                value: 11,
                message: "Máximo 11 caracteres",
              },
              pattern: {
                value: /^[a-zA-Z0-9]+$/,
                message: "Solo se permiten letras y números sin espacios",
              },
            })}
          />
          {errors && errors.plate && <Error error={errors.plate.message} />}
          {isLoading 
          ? <Loader />
          : <button type="submit" className="btn btn-primary mx-auto mt-3">
              Buscar
            </button>
        }
        </div>
      </form>
    </>
  );
};
