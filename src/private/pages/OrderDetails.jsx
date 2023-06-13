import React, { useRef, useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
import { ConfirmationModal } from "../../components/ConfirmationModal";
import { FormularioReactivo } from "../../components/FormularioReactivo";
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
  const [showModal, setShowModal] = useState(false);

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
        navigate("/orders");
        setErrores(error.message);
        setLoading(false);
      }
    },
  });

  const handleEdit = () => {
    setEditing(true);
  };

  const deleteOrder = async () => {
    const url_delete = `${BASE_URL}/order/${order_id}`;
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    const response = await sendRequest(url_delete, "DELETE", null, headers);
    if (response) {
      navigate("/orders");
    }
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
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    const body = {
      ...data,
      kilometres: data.kilometres.replace(/\./g, ""),
    };
    const response = await sendRequest(
      url_update,
      "POST",
      JSON.stringify(body),
      headers
    );

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
          <Link to="/orders" className="btn btn-primary">
            Volver
          </Link>
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
                      <label className="">ID de orden</label>
                      <div className="form-control bg-success">
                        {formData.id}
                      </div>
                    </div>
                    <div className="mt-3">
                      <label className=""> Kilómetros</label>
                      {editing ? (
                        <>
                          <input
                            type="text"
                            maxLength="10"
                            {...register("kilometres", {
                              required: {
                                value: true,
                                message: "Campo requerido.",
                              },
                              maxLength: {
                                value: 10,
                                message: "Longitud máxima 10 caracteres.",
                              },
                              minLength: {
                                value: 1,
                                message: "Longitud mínima 1 caracter.",
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
                      <label className="">Estado</label>
                      <div
                        className="form-control"
                        style={{ backgroundColor: "#e9ecef" }}
                      >
                        {formData.state == 0 ? "En proceso" : "Cerrada"}
                      </div>
                    </div>
                    <div className=" mt-3">
                      <label className="">Creación</label>
                      <div className="form-control bg-success">
                        {formData.date_in?.split("-").reverse().join("-") || ""}
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-6 pt-5 pt-md-0 ps-2">
                    <h4>Datos del cliente</h4>
                    <div>
                      <div className=" mt-3">
                        <label className="">Nombre/s</label>
                        {editing ? (
                          <>
                            <input
                              type="text"
                              {...register("name", {
                                required: {
                                  value: true,
                                  message: "Campo requerido.",
                                },
                                maxLength: {
                                  value: 50,
                                  message: "Longitud máxima 50 caracteres.",
                                },
                              })}
                              className="form-control"
                              maxLength="50"
                            />
                            {error && error.name && (
                              <Error
                                error={error.name}
                                clearError={clearError}
                              />
                            )}
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
                        <label className="">Apellido/s</label>
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
                              maxLength="50"
                              className="form-control"
                            />
                            {error && error.surname && (
                              <Error
                                error={error.surname}
                                clearError={clearError}
                              />
                            )}
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
                        <label className="">Email</label>
                        {editing ? (
                          <>
                            <input
                              type="email"
                              {...register("email", {
                                pattern: {
                                  value:
                                    /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                                  message: "Email inválido",
                                },
                                maxLength: {
                                  value: 50,
                                  message: "Longitud máxima 50",
                                },
                              })}
                              className="form-control"
                              maxLength="50"
                            />
                            {error && error.email && (
                              <Error
                                error={error.email}
                                clearError={clearError}
                              />
                            )}
                            {errors && errors.email && (
                              <Error error={errors.email.message} />
                            )}
                          </>
                        ) : (
                          <div
                            className="form-control"
                            style={{ backgroundColor: "#e9ecef" }}
                          >
                            {formData.email || "No especificado"}
                          </div>
                        )}
                      </div>
                      <div className=" mt-3">
                        <label className="">Teléfono</label>
                        {editing ? (
                          <>
                            <input
                              type="text"
                              {...register("phone", {
                                pattern: {
                                  value: /^[0-9]*$/,
                                  message: "Solo se permiten números",
                                },
                                maxLength: {
                                  value: 11,
                                  message: "Longitud máxima 11",
                                },
                              })}
                              maxLength="11"
                              className="form-control"
                            />
                            {error && error.phone && (
                              <Error
                                error={error.phone}
                                clearError={clearError}
                              />
                            )}
                            {errors && errors.phone && (
                              <Error error={errors.phone.message} />
                            )}
                          </>
                        ) : (
                          <div
                            className="form-control"
                            style={{ backgroundColor: "#e9ecef" }}
                          >
                            {formData.phone || "No especificado"}
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
                  {editing && !isLoading && (
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
                  {isLoading && <Loader></Loader>}
                  {loading && <Loader></Loader>}
                </div>
              </form>
            </div>

            <div className="row mt-5">
              <FormularioReactivo formName={"orderDetails"}/>
            </div>
            <div className="row mt-5">
              <h3 className="text-center">Anomalías</h3>
              <div className="col-xs-12 col-md-12  p-4 shadow-lg border border-1 rounded">
                <div className="p-2">
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

            <StudentAssigned order={order_id} />
            <WorksAndMaterials order={order_id} />
            <div className="col-12 d-flex justify-content-center gap-2 my-5 py-4">
              {isLoading && showModal ? (
                <Loader></Loader>
              ) : (
                <>
                  <button
                    className="btn btn-primary"
                    onClick={handleCloseOrder}
                  >
                    Cerrar orden
                  </button>
                  <button
                    className="btn btn-danger text-white"
                    onClick={() => setShowModal(true)}
                  >
                    Borrar orden
                  </button>
                </>
              )}
            </div>
          </div>
          <ConfirmationModal
            show={showModal}
            message="¿Está seguro que desea borrar la orden? Esto borrará los datos asociados."
            onConfirm={() => deleteOrder(order_id)}
            onCancel={() => setShowModal(false)}
          />
        </>
      ) : (
        //A PARTIR DE ACA EMPIEZA LA SECCIÓN DE ORDEN FINALIZADA
        <>
          <div className="d-flex justify-content-between">
            <Link className="btn btn-primary" to={"/orders"}>
              Volver
            </Link>
            <button className="btn btn-primary" onClick={handlePrint}>
              Generar pdf
            </button>
          </div>
          <h3 className="text-center p-0">Detalles de la orden</h3>
          <div
            className="mt-5 col-12 shadow-lg border border-1 rounded p-4"
            ref={componentToPrint}
            id="real-estates-detail"
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
                  <label className="">ID de orden</label>
                  <div
                    className="form-control"
                    style={{ backgroundColor: "#e9ecef" }}
                  >
                    {formData.id}
                  </div>
                </div>
                <div className="mt-3">
                  <label className=""> Kilómetros</label>
                  <div
                    className="form-control"
                    style={{ backgroundColor: "#e9ecef" }}
                  >
                    {formatNumber(formData.kilometres.toString()) || ""}
                  </div>
                </div>
                <div className="mt-3">
                  <label className="">Estado</label>
                  <div
                    className="form-control"
                    style={{ backgroundColor: "#e9ecef" }}
                  >
                    {formData.state == 1 ? "Cerrada" : "Abierta"}
                  </div>
                </div>
                <div className=" mt-3">
                  <label className="">
                    Fecha de creación - Fecha de cierre
                  </label>
                  <div
                    className="form-control"
                    style={{ backgroundColor: "#e9ecef" }}
                  >
                    {formData.date_in?.split("-").reverse().join("-") || ""} /{" "}
                    {formData.date_out?.split("-").reverse().join("-") || ""}
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-6 pt-5 pt-md-0 ps-2">
                <h4>Datos del cliente</h4>
                <div>
                  <div className=" mt-3">
                    <label className="">Nombre/s</label>
                    <div
                      className="form-control"
                      style={{ backgroundColor: "#e9ecef" }}
                    >
                      {formData.name || ""}
                    </div>
                  </div>
                  <div className=" mt-3">
                    <label className="">Apellido/s</label>
                    <div
                      className="form-control"
                      style={{ backgroundColor: "#e9ecef" }}
                    >
                      {formData.surname || ""}
                    </div>
                  </div>
                  <div className=" mt-3">
                    <label className="">Email</label>
                    <div
                      className="form-control"
                      style={{ backgroundColor: "#e9ecef" }}
                    >
                      {formData.email || "No especificado"}
                    </div>
                  </div>
                  <div className=" mt-3">
                    <label className="">Teléfono</label>
                    <div
                      className="form-control"
                      style={{ backgroundColor: "#e9ecef" }}
                    >
                      {formData.phone || "No especificado"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5 p-0">
              <h3 className="text-center">Anomalías</h3>
              <div className="col-xs-12 col-md-12">
                <div>
                  <h5>Anomalías declaradas</h5>
                  <ul className="p-0">
                    {formDataAnomalies.length > 0
                      ? formDataAnomalies.map((each) => {
                          return (
                            <div
                              key={each.id}
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
                      key={each.id}
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
                      key={each.id}
                      className="form-control mb-2"
                      style={{ backgroundColor: "#e9ecef" }}
                    >
                      {each}
                    </div>
                  );
                })}
            </div>
            <div className="mt-2">
              <h3 className="text-center">Materiales</h3>
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
                      <tr key={each.id}>
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
                  <td colSpan="3" style={{ backgroundColor: "#e9ecef" }}>
                    Total
                  </td>
                  <td style={{ backgroundColor: "#e9ecef" }}>
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
