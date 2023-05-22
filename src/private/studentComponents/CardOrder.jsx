import React, { useEffect, useState } from "react";
import { Error } from "../../components/Error";
import { useForm } from "react-hook-form";
import { BASE_URL } from "../../api/api";
import useHttp from "../../hooks/useHttp";
import { useToken } from "../../hooks/useToken";
import { Loader } from "../../components/Loader";

export const CardOrder = ({
  plate,
  anomalies,
  id,
  comment,
  state,
  handleComplete,
  work,
  error,
  clearError,
}) => {
  const { getToken } = useToken();
  const { sendRequest, isLoading } = useHttp();
  const [materials, setMaterials] = useState([]);
  const [newMaterials, setNewMaterials] = useState([]);
  // const [newWorks, setNewWorks] = useState([])
  const [isEditMaterial, setIsEditMaterial] = useState(false);
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

  useEffect(() => {
    
  }, []);

  const handleAddMaterial = async (e) => {
    e.preventDefault();
    const description = getValues("material");
    const quantity = getValues("quantity") || "1";
    if (description == "") {
      return;
    }
    const body = {
      description,
      quantity,
      order_id: id,
    };
    const urlAddWorks = `${BASE_URL}/material`;
    const token = getToken();
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const response = await sendRequest(
      urlAddWorks,
      "POST",
      JSON.stringify(body),
      headers
    );
    if (response) {
      setValue("material", "");
      setValue("quantity", "");

      setMaterials(response);
    }
  };

  const handleAddWork = async (e) => {
    e.preventDefault();
    const newWork = getValues("work_description");
    if (newWork == "") {
      return;
    }
    const urlAddWorks = `${BASE_URL}/work/student/create`;
    const token = getToken();
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    const body = {
      description: newWork,
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
        <h1 class="accordion-header">
          <button
            class="accordion-button collapsed fs-2 text-white"
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

          <form onSubmit={handleSubmit()} className="row mt-3 gap-3">
            <div className="col-12">
              <h5 className="card-title">Trabajos</h5>
              {/* {
                            works.length > 0
                                ? works.map((each, index) => {
                                    return (
                                        <div className='col-12 d-flex gap-1 mb-2' key={index} >
                                            <p className='m-1 py-1 form-control' style={{ backgroundColor: "#e9ecef" }}>{each.description}</p>
                                            <button className="btn btn-danger" onClick={(e) => handleDeleteWork(e, each.id)}>Borrar</button>
                                        </div>
                                    )
                                })
                                : <p className='mt-2'>Sin trabajos</p>
                        } */}
              <div className="d-flex justify-content-between mb-3">
                <input
                  {...register("work_description")}
                  className="form-control"
                  placeholder="Describa aquí los trabajos realizados"
                  id=""
                  height="100%"
                  cols="30"
                  rows="10"
                />

                {!isLoading && (
                  <button type="submit" className="btn" onClick={handleAddWork}>
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
                      <button
                        className="btn btn-danger text-white"
                        onClick={(e) => handleDeleteWork(e, each.id)}
                      >
                        Quitar
                      </button>
                    </div>
                  );
                })
              ) : (
                <p className="mt-2">Sin trabajos</p>
              )}
            </div>
            <div className="col-12">
              <h5 className="card-title">Materiales</h5>
              <div className="d-flex align-items-center gap-3">
                <div className="w-75 d-flex align-items-center">
                  <label htmlFor="">Descripción:</label>
                  <input
                    type="text"
                    {...register("material")}
                    className="form-control"
                  />
                </div>
                <div className="d-flex align-items-center">
                  <label htmlFor="">Cantidad:</label>
                  <input
                    type="number"
                    {...register("quantity")}
                    className="form-control"
                  />
                </div>
                <button
                  type="submit"
                  className="btn"
                  onClick={handleAddMaterial}
                >
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

                      <button
                        className="btn btn-danger text-white"
                        onClick={(e) => handleDeleteMaterial(e, each.id)}
                      >
                        Quitar
                      </button>
                    </div>
                  );
                })
              ) : (
                <p className="mt-2">Sin materiales</p>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
