import React, { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader } from "../../components/Loader";
import { AddAnomaly } from "../components/AddAnomaly";
import { Anomaly } from "../components/Anomaly";
import { Main } from "../components/global/Main";
import { BASE_URL } from "../../api/api";
import useHttp from "../../hooks/useHttp";
import { useForm } from "react-hook-form";
import { useReactToPrint } from "react-to-print";
import { StudentAssigned } from "./StudentAssigned";
import { WorksAndMaterials } from "../components/WorksAndMaterials";
import { Error } from "../../components/Error";
import { useToken } from "../../hooks/useToken";

export const OrderDetails = () => {
  const navigate = useNavigate();
  const { order_id } = useParams();
  const componentToPrint = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentToPrint.current,
    documentTitle: "order-details",
  });

  const token = JSON.parse(localStorage.getItem("token"));
  const url = `${BASE_URL}/order/${order_id}/details`;
  const url_update = `${BASE_URL}/order/${order_id}/update`;
  const url_final_details = `${BASE_URL}/order/finalDetails/${order_id}`;
  const [order, setOrder] = useState(null);
  const { getToken } = useToken();
  const [formData, setFormData] = useState({});
  const [anomalies, setAnomalies] = useState([]);
  const [plate, setPlate] = useState([]);
  const [formDataAnomalies, setFormDataAnomalies] = useState([]);
  const { sendRequest, error, clearError, isLoading } = useHttp();
  const [loading, setLoading] = useState(true);
  const [errores, setErrores] = useState(null);
  const [editing, setEditing] = useState(false);
  const [dataToPDF, setDataToPDF] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: async () => {
      try {
        setLoading(true);
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        console.log(data);
        setOrder(data.order);
        if (data.order.state == 1) {
          setIsFinished(true);
        }
        setPlate(data.plate);
        setFormData(data.order);
        setAnomalies(data.order.anomalies);
        setFormDataAnomalies(data.order.anomalies);
        setLoading(false);
        return data.order;
      } catch (error) {
        setErrores(error.message);
        setLoading(false);
      }
    },
  });

  const handleEdit = () => {
    setEditing(true);
  };

  const onSubmitAnomaly = async (id, newdescription) => {
    const data = {
      id,
      description: newdescription,
    };
    const url = `${BASE_URL}/anomaly/update`;
    const requestOptions = {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await fetch(url, requestOptions);
      const data = await response.json();
      let temp_anomalies = anomalies.map((anomaly) => {
        if (id == anomaly.id) {
          anomaly.description = newdescription;
        }
        return anomaly;
      });
      setAnomalies(temp_anomalies);
    } catch (error) {
      return error;
    }
  };

  const handleCancelEditOrder = () => {
    setFormData(order);
    setEditing(false);
    reset(formData);
    clearError();
  };

  useEffect(() => {
    const token = getToken();
    const url = `${BASE_URL}/order/finalDetails/${order_id}`;
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    const getFinalDetails = async () => {
      const response = await sendRequest(url, "GET", null, headers);
      if (response) {
        setDataToPDF(response);
      }
    };
    if (isFinished) {
      getFinalDetails();
    }
  }, [isFinished]);

  const onSubmit = async (data) => {
    console.log(data);
    console.log(data);

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    const body = JSON.stringify(data);
    const response = await sendRequest(url_update, "POST", body, headers);

    if (response) {
      setOrder(response.order);
      setFormData(response.order);
      reset(response.order);
      setEditing(false);
    }
    setLoading(false);
  };

  const handleCloseOrder = async () => {
    const url_close = `${BASE_URL}/order/close/${order_id}`;
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    const response = await sendRequest(url_close, "PUT", null, headers);
    if (response) {
      navigate("/orders");
    }
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
    const formattedValue = formatNumber(value);
    setValue("kilometres", formattedValue);
  };

  return (
    <Main page="order_page">
      {loading ? (
        <Loader />
      ) : formData.state === 0 ? (
        <>
          <div id="main" className="container">
            <div className="row mt-5" id="real-estates-detail">
              <h3 className="text-center">Detalles de la orden</h3>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="p-3 shadow-lg border border-1 rounded"
              >
                <div className="row p-3">
                  <h4 className="d-inline-block">
                    {plate && `Matrícula: ${plate}`}
                  </h4>
                </div>
                <div className="row p-3">
                  <div className="col-12 col-md-6 pe-2">
                    <h4>Datos de la orden</h4>
                    <div className=" mt-3">
                      <label className="">ID de orden:</label>
                      <div className="form-control bg-success">
                        {formData.id}
                      </div>
                    </div>
                    <div className="mt-3">
                      <label className=""> Kilometros:</label>
                      {editing ? (
                        <>
                          <input
                            type="text"
                            maxLength="10"
                            {...register("kilometres", {
                              required: {
                                value: true,
                                message: "Campo requerido",
                              },
                              maxLength: {
                                value: 10,
                                message: "Longitud maxima 10 caracteres",
                              },
                              minLength: {
                                value: 1,
                                message: "Longitud minima 1 caracter",
                              },
                            })}
                            className="form-control"
                            onChange={handleKilometresChange}
                          />
                          {error && error.kilometres && (
                            <Error
                              error={error.kilometres}
                              clearError={clearError}
                            />
                          )}
                          {errors && errors.kilometres && (
                            <Error error={errors.kilometres.message} />
                          )}
                        </>
                      ) : (
                        <div
                          className="form-control"
                          style={{ backgroundColor: "#e9ecef" }}
                        >
                          {formatNumber(formData.kilometres.toString()) || ""}
                        </div>
                      )}
                    </div>
                    <div className="mt-3">
                      <label className="">Estado:</label>
                      <div
                        className="form-control"
                        style={{ backgroundColor: "#e9ecef" }}
                      >
                        {formData.state == 0 ? "En proceso" : "Finalizada"}
                      </div>
                    </div>
                    <div className=" mt-3">
                      <label className="">Creacion:</label>
                      <div className="form-control bg-success">
                        {formData.date_in?.split("-").reverse().join("-") || ""}
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-6 pt-5 pt-md-0 ps-2">
                    <h4>Datos del cliente</h4>
                    <div>
                      <div className=" mt-3">
                        <label className="">Nombre/s:</label>
                        {editing ? (
                          <>
                            <input
                              type="text"
                              {...register("name", {
                                required: {
                                  value: true,
                                  message: "Campo requerido",
                                },
                                maxLength: {
                                  value: 50,
                                  message: "Longitud máxima 50",
                                },
                              })}
                              className="form-control"
                            />
                            {errors && errors.name && (
                              <Error error={errors.name.message} />
                            )}
                          </>
                        ) : (
                          <div
                            className="form-control"
                            style={{ backgroundColor: "#e9ecef" }}
                          >
                            {formData.name || ""}
                          </div>
                        )}
                      </div>
                      <div className=" mt-3">
                        <label className="">Apellido/s:</label>
                        {editing ? (
                          <>
                            <input
                              type="text"
                              {...register("surname", {
                                required: {
                                  value: true,
                                  message: "Campo requerido",
                                },
                                maxLength: {
                                  value: 50,
                                  message: "Longitud máxima 50",
                                },
                              })}
                              className="form-control"
                            />
                            {errors && errors.surname && (
                              <Error error={errors.surname.message} />
                            )}
                          </>
                        ) : (
                          <div
                            className="form-control"
                            style={{ backgroundColor: "#e9ecef" }}
                          >
                            {formData.surname || ""}
                          </div>
                        )}
                      </div>
                      <div className=" mt-3">
                        <label className="">Email:</label>
                        {editing ? (
                          <>
                            <input
                              type="text"
                              {...register("email", {
                                required: {
                                  value: true,
                                  message: "Campo requerido",
                                },
                                maxLength: {
                                  value: 50,
                                  message: "Longitud máxima 50",
                                },
                              })}
                              className="form-control"
                            />
                            {errors && errors.email && (
                              <Error error={errors.email.message} />
                            )}
                          </>
                        ) : (
                          <div
                            className="form-control"
                            style={{ backgroundColor: "#e9ecef" }}
                          >
                            {formData.email || ""}
                          </div>
                        )}
                      </div>
                      <div className=" mt-3">
                        <label className="">Teléfono:</label>
                        {editing ? (
                          <>
                            <input
                              type="number"
                              {...register("phone", {
                                required: {
                                  value: true,
                                  message: "Campo requerido",
                                },
                                maxLength: {
                                  value: 12,
                                  message: "Máximo 12 números",
                                },
                                minLength: {
                                  value: 6,
                                  message: "Mínimo 6 números",
                                },
                              })}
                              className="form-control"
                            />
                            {errors && errors.phone && (
                              <Error error={errors.phone.message} />
                            )}
                          </>
                        ) : (
                          <div
                            className="form-control"
                            style={{ backgroundColor: "#e9ecef" }}
                          >
                            {formData.phone || ""}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 mt-3 d-flex justify-content-center gap-4">
                  {!editing && !loading && (
                    <button
                      type="button"
                      className="btn btn-warning"
                      onClick={handleEdit}
                    >
                      Editar
                    </button>
                  )}
                  {editing && (
                    <>
                      <button type="submit" className="btn btn-primary">
                        Guardar
                      </button>
                      <button
                        type="submit"
                        onClick={handleCancelEditOrder}
                        className="btn btn-danger text-white"
                      >
                        Cancelar
                      </button>
                    </>
                  )}
                  {loading && <Loader></Loader>}
                </div>
              </form>

              <div className="mt-5 p-0">
                <h3 className="text-center">Anomalías</h3>
                <div className="col-xs-12 col-md-12  p-3 shadow-lg border border-1 rounded">
                  <div>
                    <h5>Anomalías declaradas</h5>
                    <ul className="p-0">
                      {loading
                        ? "Cargando..."
                        : formDataAnomalies.length > 0
                        ? formDataAnomalies.map((anomaly, index) => {
                            return (
                              <Anomaly
                                onSubmitAnomaly={onSubmitAnomaly}
                                key={anomaly.id}
                                {...anomaly}
                                index={index}
                                setFormDataAnomalies={setFormDataAnomalies}
                                setAnomalies={setAnomalies}
                              />
                            );
                          })
                        : "Esta orden no tiene anomalías asociadas"}
                    </ul>
                    <AddAnomaly
                      order={order_id}
                      setFormDataAnomalies={setFormDataAnomalies}
                      setAnomalies={setAnomalies}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 text-center p-4"></div>
          </div>
          <StudentAssigned order={order_id} />
          <WorksAndMaterials order={order_id} />
          <div className="col-12 d-flex justify-content-center my-5 py-4">
            <button className="btn btn-primary" onClick={handleCloseOrder}>
              Cerrar orden
            </button>
          </div>
        </>
      ) : (
        //A PARTIR DE ACA EMPIEZA LA SECCIÓN DE ORDEN FINALIZADA
        <>
          <div className="d-flex justify-content-end">
            <button className="btn btn-primary" onClick={handlePrint}>
              Generar pdf
            </button>
          </div>
          <div className="row shadow " ref={componentToPrint}>
            <div className="row mt-5" id="real-estates-detail">
              <h3 className="text-center p-0">Detalles de la orden</h3>
              <div className="row p-3">
                <h4 className="d-inline-block">
                  {plate && `Matrícula: ${plate}`}
                </h4>
              </div>
              <div className="row p-3">
                <div className="col-12 col-md-6 pe-2">
                  <h4>Datos de la orden</h4>
                  <div className=" mt-3">
                    <label className="">ID de orden:</label>
                    <div
                      className="form-control"
                      style={{ backgroundColor: "#e9ecef" }}
                    >
                      {formData.id}
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className=""> Kilometros:</label>
                    <div
                      className="form-control"
                      style={{ backgroundColor: "#e9ecef" }}
                    >
                      {formatNumber(formData.kilometres.toString()) || ""}
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="">Estado:</label>
                    <div
                      className="form-control"
                      style={{ backgroundColor: "#e9ecef" }}
                    >
                      {formData.state || ""}
                    </div>
                  </div>
                  <div className=" mt-3">
                    <label className="">Creacion:</label>
                    <div
                      className="form-control"
                      style={{ backgroundColor: "#e9ecef" }}
                    >
                      {formData.date_in?.split("-").reverse().join("-") || ""}
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-6 pt-5 pt-md-0 ps-2">
                  <h4>Datos del cliente</h4>
                  <div>
                    <div className=" mt-3">
                      <label className="">Nombre/s:</label>
                      <div
                        className="form-control"
                        style={{ backgroundColor: "#e9ecef" }}
                      >
                        {formData.name || ""}
                      </div>
                    </div>
                    <div className=" mt-3">
                      <label className="">Apellido/s:</label>
                      <div
                        className="form-control"
                        style={{ backgroundColor: "#e9ecef" }}
                      >
                        {formData.surname || ""}
                      </div>
                    </div>
                    <div className=" mt-3">
                      <label className="">Email:</label>
                      <div
                        className="form-control"
                        style={{ backgroundColor: "#e9ecef" }}
                      >
                        {formData.email || ""}
                      </div>
                    </div>
                    <div className=" mt-3">
                      <label className="">Teléfono:</label>
                      <div
                        className="form-control"
                        style={{ backgroundColor: "#e9ecef" }}
                      >
                        {formData.phone || ""}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 p-0">
                <h3 className="text-center">Anomalías</h3>
                <div className="col-xs-12 col-md-12 p-3">
                  <div>
                    <h5>Anomalías declaradas</h5>
                    <ul className="p-0">
                      {formDataAnomalies.length > 0
                        ? formDataAnomalies.map((each) => {
                            return (
                              <div
                                className="form-control mb-2"
                                style={{ backgroundColor: "#e9ecef" }}
                              >
                                {each.description}
                              </div>
                            );
                          })
                        : "Esta orden no tiene anomalías asociadas"}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="mt-2">
                <h3 className="text-center">Trabajos</h3>
                {dataToPDF &&
                  dataToPDF.works.length > 0 &&
                  dataToPDF.works.map((each) => {
                    return (
                      <div
                        className="form-control mb-2"
                        style={{ backgroundColor: "#e9ecef" }}
                      >
                        {each}
                      </div>
                    );
                  })}
              </div>
              <div className="mt-2">
                <h3 className="text-center">Alumnos</h3>
                {dataToPDF &&
                  dataToPDF.students.length > 0 &&
                  dataToPDF.students.map((each) => {
                    return (
                      <div
                        className="form-control mb-2"
                        style={{ backgroundColor: "#e9ecef" }}
                      >
                        {each}
                      </div>
                    );
                  })}
              </div>
              <div className="mt-2">
                <h3 className="text-center">Matariales</h3>
                <table class="table table-striped table-hover">
                  <tr>
                    <td>Descripción</td>
                    <td>Cantidad</td>
                    <td>Precio</td>
                    <td>Total</td>
                  </tr>
                  {dataToPDF &&
                    dataToPDF.materials.length > 0 &&
                    dataToPDF.materials.map((each) => {
                      return (
                        <tr>
                          <td style={{ backgroundColor: "#e9ecef" }}>
                            {" "}
                            {each.description}
                          </td>
                          <td style={{ backgroundColor: "#e9ecef" }}>
                            {" "}
                            {each.quantity}
                          </td>
                          <td style={{ backgroundColor: "#e9ecef" }}>
                            {" "}
                            {each.price}€
                          </td>
                          <td style={{ backgroundColor: "#e9ecef" }}>
                            {each.price * each.quantity}€
                          </td>
                        </tr>
                      );
                    })}
                  <tr>
                    <td
                      colSpan="3"
                      className="h5"
                      style={{ backgroundColor: "#e9ecef" }}
                    >
                      Total
                    </td>
                    <td className="h5" style={{ backgroundColor: "#e9ecef" }}>
                      {dataToPDF &&
                        dataToPDF.materials
                          .reduce((prev, acc) => {
                            return prev + acc.price * acc.quantity;
                          }, 0)
                          .toString()}
                      €
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </div>

          {/* {dataToPDF && (
            <div ref={componentToPrint}>
              <TablePDF data={dataToPDF} />
            </div>
          )} */}
        </>
      )}
    </Main>
  );
};
