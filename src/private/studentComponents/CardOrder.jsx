import React, { useEffect, useState } from "react";
import { Error } from "../../components/Error";
import { useForm } from "react-hook-form";
import { BASE_URL } from "../../api/api";
import useHttp from "../../hooks/useHttp";
import { useToken } from "../../hooks/useToken";
import { Loader } from "../../components/Loader";
import { Materials } from "./Materials";

export const CardOrder = ({
  plate,
  anomalies,
  id,
  state,
  closed
}) => {
  console.log(state)
  const { getToken } = useToken();
  const { sendRequest, isLoading, error, clearError } = useHttp();
  const [materials, setMaterials] = useState([]);
  const [works, setWorks] = useState([]);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    getValues,
    setValue,
  } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      const url = `${BASE_URL}/orders/worksandmaterials/${id}`;
      const token = getToken();
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      const response = await sendRequest(url, "GET", null, headers);
      if (response) {
        setMaterials(response.materials);
        setWorks(response.works);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {}, []);


  const handleAddWork = async (data) => {
    const urlAddWorks = `${BASE_URL}/work/student/create`;
    const token = getToken();
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    const body = {
      description: data.work_description,
      order_id: id,
    };

    const response = await sendRequest(
      urlAddWorks,
      "POST",
      JSON.stringify(body),
      headers
    );
    if (response) {
      setValue("work_description", "");
      setWorks(response);
    }
  };

  const handleDeleteMaterial = async (e, id) => {
    e.preventDefault();
    const url_delete = `${BASE_URL}/material/delete/${id}`;
    const token = getToken();
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const response = await sendRequest(url_delete, "DELETE", null, headers);
    if (response) {
      const temp_materials = materials.filter((each) => each.id != id);
      setMaterials(temp_materials);
    }
  };

  const handleDeleteWork = async (e, id) => {
    e.preventDefault();
    const url_delete = `${BASE_URL}/work/delete/${id}`;
    const token = getToken();
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const response = await sendRequest(url_delete, "DELETE", null, headers);
    if (response) {
      const temp_works = works.filter((each) => each.id != id);
      setWorks(temp_works);
    }
  };

  return (
    <>
      <div className="accordion-item p-2">
        <h1 className="accordion-header">
          <button
            className="accordion-button collapsed fs-2 text-white"
            style={{ backgroundColor: "#027373" }}
            type="button"
            data-bs-toggle="collapse"
            data-bs-target={`#flush-collapse${id}`}
            aria-expanded="false"
            aria-controls={`flush-collapse${id}`}
          >
            {plate}
          </button>
        </h1>
        <div
          id={`flush-collapse${id}`}
          className="accordion-collapse collapse"
          data-bs-parent="#accordionFlushExample"
        >
          <h5 className="my-3">Anomalías</h5>
          {anomalies &&
            anomalies.length > 0 &&
            anomalies.map((each, index) => {
              return (
                <div
                  key={index}
                  className="form-control mb-1"
                  style={{ backgroundColor: "#e9ecef" }}
                >
                  {each}
                </div>
              );
            })}

          <form
            onSubmit={handleSubmit(handleAddWork)}
            className="row mt-3 gap-3"
          >
            <div className="col-12">
              <h5 className="card-title">Trabajos</h5>
              <div className="d-flex justify-content-between mb-3">
                {!closed && (
                  <input
                    {...register("work_description", {
                      required: {
                        value: true,
                        message: "Debe ingresar una descripción",
                      },
                      maxLength: {
                        value: 200,
                        message:
                          "La descripción no puede superar los 200 caracteres",
                      },
                    })}
                    className="form-control"
                    placeholder="Describa aquí los trabajos realizados"
                    id=""
                    height="100%"
                    cols="30"
                    rows="10"
                  />
                )}

                {!isLoading && !closed && (
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
              {errors &&
                errors.work_description &&
                errors.work_description.message && (
                  <Error error={errors.work_description.message} />
                )}
              {error && error.description && (
                <Error error={error.description} clearError={clearError} />
              )}
              {isLoading && <Loader />}
              {works.length > 0 ? (
                works.map((each, index) => {
                  return (
                    <div className="col-12 d-flex gap-1 mb-2" key={index}>
                      <p
                        className="m-1 py-1 form-control"
                        style={{ backgroundColor: "#e9ecef" }}
                      >
                        {each.description}
                      </p>
                      {!closed && (
                        <button
                          className="btn btn-danger text-white"
                          onClick={(e) => handleDeleteWork(e, each.id)}
                        >
                          Quitar
                        </button>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="mt-2">Sin trabajos</p>
              )}
            </div>
          </form>
          <div className="col-12">
            <h5 className="card-title">Materiales</h5>
            {!closed && <Materials order_id={id} setMaterials={setMaterials} />}
            {materials.length > 0 ? (
              materials.map((each, index) => {
                return (
                  <div className="col-12 d-flex gap-1 mb-2 mt-2" key={index}>
                    <p
                      className="m-1 py-1 form-control w-75"
                      style={{ backgroundColor: "#e9ecef" }}
                    >
                      {each.description}
                    </p>
                    <p
                      className="m-1 py-1 form-control w-25"
                      style={{ backgroundColor: "#e9ecef" }}
                    >
                      {each.quantity}
                    </p>

                    {!closed && (
                      <button
                        className="btn btn-danger text-white"
                        onClick={(e) => handleDeleteMaterial(e, each.id)}
                      >
                        Quitar
                      </button>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="mt-2">Sin materiales</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
