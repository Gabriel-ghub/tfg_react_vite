import { useEffect } from "react";
import uuid from "react-uuid";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Main } from "../components/global/Main";
import { Loader } from "../../components/Loader";
import { validationType } from "../../validations/validator";
import { Error } from "../../components/Error";
import { useForm } from "react-hook-form";
import { BASE_URL } from "../../api/api";
import { useToken } from "../../hooks/useToken";
import useHttp from "../../hooks/useHttp";
const url_anomaly = `${BASE_URL}/anomaly/create`;
const url_order = `${BASE_URL}/order/create`;
export const CreateOrder = () => {
  const { plate_car } = useParams();
  const { sendRequest, isLoading, error, clearError } = useHttp();
  const { getToken } = useToken();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors
  } = useForm();
  const [newAnomaly, setNewAnomaly] = useState("");
  const [errorsEmpty, setErrorsEmpty] = useState(false);
  const navigate = useNavigate();
  const [anomalies, setAnomalies] = useState([]);
  const [carFound, setCarFound] = useState(null);

  useEffect(() => {
    const getCarInfo = async (matricula) => {
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
        };
        setCarFound(car);
      } else {
        navigate("/car");
        setCarFound(null);
      }
    };
    getCarInfo(plate_car);
  }, []);

  async function handleCreateOrder(order, anomalies) {
    if (!anomalies || anomalies.length < 1) {
      setAnomalies([]);
      return;
    }
    const token = getToken();
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const body = JSON.stringify(order);

    const response = await sendRequest(url_order, "POST", body, headers);
    if (response) {
      let data = anomalies.map((anomaly) => {
        return anomaly.description;
      });
      let data_anomalias = {
        anomalias: data,
        order_id: response.data.id,
      };
      const body = JSON.stringify(data_anomalias);

      const response2 = await sendRequest(url_anomaly, "POST", body, headers);
      if (response2) {
        navigate(`/orders/${response2}/details`);
      }
    }
  }

  const addAnomaly = (e) => {
    e.preventDefault();
    if (newAnomaly.trim().length < 1) {
      setNewAnomaly("");
      return;
    }
    if (newAnomaly == "") return;
    let anomaly = {
      id: uuid(),
      description: validationType["sanitize"](newAnomaly),
    };
    setAnomalies([...anomalies, anomaly]);
    setNewAnomaly("");
  };

  const clearErrorEmpty = () => {
    setErrorsEmpty("");
  };
  const deleteAnomaly = (id) => {
    let temp_anomalies = anomalies.filter((anomaly) => anomaly.id !== id);
    setAnomalies(temp_anomalies);
  };

  const formatNumber = (value) => {
    // Eliminar todos los caracteres que no sean dígitos
    const digitsOnly = value.replace(/\D/g, "");
    // Agregar separador de miles cada 3 dígitos
    const formattedValue = digitsOnly.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    return formattedValue;
  };

  const handleKilometresChange = (event) => {
    const { name, value } = event.target;
    clearErrors("kilometres")
    const formattedValue = formatNumber(value);
    setValue("kilometres", formattedValue);
  };
  const onSubmit = (data) => {
    if (anomalies.length < 1) {
      setErrorsEmpty("Debe crear al menos una anomalía.");
      return;
    }
    let today = new Date();
    let isoDate = today.toISOString();
    let formattedDate = isoDate.substr(0, 10);
    const body = {
      ...data,
      car_id: carFound.id,
      date_in: formattedDate,
      kilometres: data.kilometres.replace(/\./g, ""),
      name: validationType["validateName"](data.name),
      surname: validationType["validateName"](data.surname),
    };
    setErrorsEmpty("");
    handleCreateOrder(body, anomalies);
  };
  return (
    <Main page={"create_page"}>
      <div className="container">
        <h3 className="color--white mb-5 mt-5 p-3 text-white text-center bg-success rounded-3">
          Orden para la matrícula
          <span className="text-white"> {plate_car}</span>
        </h3>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="contact__wrapper shadow-lg mt-n9"
        >
          <div className="row no-gutters">
            <div className="col-lg-7 contact-form__wrapper p-5">
              <h2>Datos del cliente</h2>
              <div>
                <div className="row">
                  <div className="col-sm-6 mb-3">
                    <div className="form-group">
                      <label htmlFor="lastName">Nombre/s*</label>
                      <input
                        className="form-control"
                        maxLength="50"
                        type="text"
                        {...register("name", {
                          required: {
                            value: true,
                            message: "Campo requerido.",
                          },
                          maxLength: {
                            value: 50,
                            message: "Máximo 50 caracteres.",
                          },
                          pattern: {
                            value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                            message: "Solo letras.",
                          },
                        })}
                      />
                      {errors && errors.name && (
                        <Error error={errors.name.message} />
                      )}
                      {error && error.name && (
                        <Error error={error.name} clearError={clearError} />
                      )}
                    </div>
                  </div>

                  <div className="col-sm-6 mb-3">
                    <div className="form-group">
                      <label className="required-field" htmlFor="email">
                        Apellido/s*
                      </label>
                      <input
                        className="form-control"
                        maxLength="50"
                        type="text"
                        {...register("surname", {
                          required: {
                            value: true,
                            message: "Campo requerido.",
                          },
                          maxLength: {
                            value: 50,
                            message: "Máximo 50 caracteres",
                          },
                          pattern: {
                            value: /^^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                            message: "Solo letras",
                          },
                        })}
                      />
                      {errors && errors.surname && (
                        <Error error={errors.surname.message} />
                      )}
                      {error && error.surname && (
                        <Error error={error.surname} clearError={clearError} />
                      )}
                    </div>
                  </div>

                  <div className="col-sm-6 mb-3">
                    <div className="form-group">
                      <label htmlFor="phone">Teléfono</label>
                      <input
                        maxLength="12"
                        type="text"
                        className="form-control"
                        {...register("phone", {
                          pattern: {
                            value: /^(?:[0-9]+|)$/,
                            message: "Solo números",
                          },
                        })}
                      />
                      {errors && errors.phone && (
                        <Error error={errors.phone.message} />
                      )}
                      {error && error.phone && (
                        <Error error={error.phone} clearError={clearError} />
                      )}
                    </div>
                  </div>
                  <div className="col-sm-6 mb-3">
                    <div className="form-group">
                      <label htmlFor="phone">Email</label>
                      <input
                        type="email"
                        maxLength="50"
                        className="form-control"
                        {...register("email", {
                          pattern: {
                            value:
                              /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                            message: "Email inválido",
                          },
                        })}
                      />
                      {errors && errors.email && (
                        <Error error={errors.email.message} />
                      )}
                      {error && error.email && (
                        <Error error={error.email} clearError={clearError} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-start col-lg-5 contact-info__wrapper gradient-brand-color pt-0 px-5 pt-md-5">
              <h3>Datos del vehículo</h3>
              <div className="col-sm-6 mb-3">
                <div className="form-group">
                  <label className="required-field" htmlFor="firstName">
                    Kilómetros*
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    maxLength={"10"}
                    {...register("kilometres", {
                      required: {
                        value: true,
                        message: "Campo requerido.",
                      },
                      maxLength: {
                        value: 10,
                        message: "Máximo 10 caracteres.",
                      },
                      minLength: {
                        value: 1,
                        message: "Mínimo 1 caracteres.",
                      },
                    })}
                    onChange={handleKilometresChange}
                  />
                  {errors && errors.kilometres && (
                    <Error error={errors.kilometres.message} />
                  )}

                  {error && error.kilometres && (
                    <Error error={error.kilometres} clearError={clearError} />
                  )}
                </div>
              </div>
              {anomalies.length > 0 && <h4>Anomalías</h4>}
              <ul className="list-group mb-2">
                {anomalies.length > 0
                  ? anomalies.map((anomaly, index) => {
                      return (
                        <li
                          className="border p-2 rounded d-flex mb-1 align-items-center justify-content-between"
                          key={index}
                        >
                          {anomaly.description}
                          <div
                            className="btn p-0"
                            onClick={() => deleteAnomaly(anomaly.id)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              fill="currentColor"
                              className="text-danger"
                              viewBox="0 0 16 16"
                            >
                              <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                            </svg>
                          </div>
                        </li>
                      );
                    })
                  : null}
              </ul>
              <div className="col-sm-12 mb-3">
                <div className="form-group">
                  <label className="required-field" htmlFor="message">
                    ¿Qué anomalías presenta el coche?*
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Ruido en la rueda derecha"
                    name="anomalias"
                    value={newAnomaly}
                    id="anomalias"
                    onChange={(e) => setNewAnomaly(e.target.value)}
                  ></input>
                  {anomalies && anomalies.length < 1 && (
                    <Error error={"Debe agregar al menos una anomalía."} />
                  )}
                </div>
              </div>
              <div className="col-12 d-flex justify-content-center">
                <button onClick={addAnomaly} className="btn">
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
              {errorsEmpty && (
                <Error error={errorsEmpty} clearError={clearErrorEmpty} />
              )}
            </div>

            {!isLoading ? (
              <>
                <div className="py-5 d-flex justify-content-center">
                  <button type="submit" className="btn btn-primary">
                    Crear orden
                  </button>
                </div>
              </>
            ) : (
              <>
                <Loader></Loader>
              </>
            )}
          </div>
        </form>
      </div>
    </Main>
  );
};
