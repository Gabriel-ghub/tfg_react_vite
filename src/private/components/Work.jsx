import React, { useState } from "react";
import { useForm } from "../../hooks/useForm";
import { BASE_URL } from "../../api/api";
import { useToken } from "../../hooks/useToken";
import useHttp from "../../hooks/useHttp";
import { Loader } from "../../components/Loader";
import { Error } from "../../components/Error";
import { ManageWork } from "./ManageWork";
import { Link } from "react-router-dom";

export const Work = ({ work, handleUpdateWork, handleDeteleWork, handleManage, workManaging }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { description, id, onInputChange, setFormState } = useForm(work);
  const { sendRequest, isLoading, error, clearError } = useHttp();
  const { getToken } = useToken();
  const onCancel = () => {
    setIsEditing(false);
    setFormState(work);
    handleManage(null, null)
  };

  const onUpdateWork = async () => {
    if (description == work.description) {
      setIsEditing(false);
      return;
    }
    const url = `${BASE_URL}/work/update`;
    const data = {
      id,
      description,
    };
    const body = JSON.stringify(data);
    const token = getToken();
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    const response = await sendRequest(url, "PUT", body, headers);
    if (response) {
      handleUpdateWork(response);
      setIsEditing(false);
    }
  };

  const onDeleteWork = async () => {
    const url = `${BASE_URL}/work/delete/${id}`;
    const token = getToken();
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    const response = await sendRequest(url, "DELETE", null, headers);
    if (response) {
      handleDeteleWork(response);
    }

  };

  const handleEdit = (e, id) => {
    setIsEditing(true)
    handleManage(e, id)
  }
  return (
    <>
      <div className="row">
        <div className="col-12 d-flex align-center mt-2 rounded gap-2 ">
          {isEditing ? (
            <>
              <input
                type="text"
                className="form-control flex-grow-1"
                value={description}
                onChange={onInputChange}
                name="description"
              />
              <button className="btn btn-warning" onClick={onCancel}>
                Cancelar
              </button>
              <button className="btn btn-primary" onClick={onUpdateWork}>
                Guardar
              </button>
            </>
          ) : (
            <>
              <p className="flex-grow-1 mb-0 p-2" style={{ backgroundColor: "#e9ecef" }}>{description}</p>
              <button
                className="btn btn-primary"
                onClick={(e) => handleEdit(e, id)}
              >
                Editar
              </button>
              <button className="btn btn-danger text-light" onClick={onDeleteWork}>
                Borrar
              </button>
              <Link className="btn btn-success text-light" to={`/works/${id}/details`} >
                Ver alumnos
              </Link>
            </>
          )}
          {error && error.description && <Error error={error.description} clearError={clearError} />}
        </div>
      </div>

    </>
  );
};
