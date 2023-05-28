import React, { useState } from "react";
import { validationType } from "../../validations/validator";
import { useForm } from "react-hook-form";
import { ConfirmationModal } from "../../components/ConfirmationModal";
import { BASE_URL } from "../../api/api";
import { useToken } from "../../hooks/useToken";
import useHttp from "../../hooks/useHttp";
import { Error } from "../../components/Error";

export const Anomaly = ({
  id,
  description,
  onSubmitAnomaly,
  setFormDataAnomalies,
  setAnomalies
}) => {
  const url_delete_anomaly = `${BASE_URL}/anomaly/destroy`;
  const [editingAnomalies, setEditingAnomalies] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const {getToken} = useToken();
  const [showModal, setShowModal] = useState(false);
  const { isLoading, sendRequest, error } = useHttp();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    getValues,
    clearErrors
  } = useForm({
    defaultValues: {
      id: id,
      description: description,
    },
  });
  const handleEdit = (e, id) => {
    setEditingAnomalies({ id });
  };

  const destroyAnomaly = async (id) => {
    const token = getToken();
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    const body = JSON.stringify({ id });
    const response = await sendRequest(
      url_delete_anomaly,
      "DELETE",
      body,
      headers
    );
    if (response) {
      setShowModal(false);
      setAnomalies((prev) => prev.filter((anomaly) => anomaly.id != id));
      setFormDataAnomalies((prev) =>prev.filter((anomaly) => anomaly.id != id));
    }
  };

  const handleCancelEdit = () => {
    setEditingAnomalies(false);
    clearErrors();
    setValue("description", description);
  };

  function handleSubmitAnomaly(data) {
    const { id, description: changedDescription } = data;
    if (description === changedDescription) {
      return setEditingAnomalies(false);
    }
    setIsSending(true);
    onSubmitAnomaly(id, validationType["sanitize"](changedDescription))
      .then((res) => {
        setIsSending(false);
        return setEditingAnomalies(false);
      })
      .catch((err) => {
        setIsSending(false);
        alert("error al actualizar");
      });
  }

  return (
    <>
      <form onSubmit={handleSubmit(handleSubmitAnomaly)} className="p-0">
        <li className="d-flex flex-column flex-md-row my-2 gap-2">
          {editingAnomalies.id != id ? (
            <>
              <p
                className="flex-grow-1 mb-0 rounded p-2"
                style={{ backgroundColor: "#e9ecef" }}
              >
                {description}
              </p>
            </>
          ) : (
            <>
              <input
                className="form-control"
                {...register("description", {
                  required: {
                    value: true,
                    message: "Campo requerido",
                  },
                  minLength: {
                    value: 6,
                    message: "Mínimo 6 caracteres",
                  },
                  maxLength: {
                    value: 200,
                    message: "Máximo 200 caracteres",
                  },
                })}
              ></input>
            </>
          )}

          {editingAnomalies.id != id ? (
            isLoading ? (
              "Borrando..."
            ) : (
              <div className="d-flex gap-1">
                <button
                  className="btn btn-warning"
                  onClick={(e) => handleEdit(e, id)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger text-white"
                  onClick={() => {
                    setShowModal(true);
                  }}
                >
                  Quitar
                </button>
              </div>
            )
          ) : isSending ? (
            <h5 className="">"Enviando..."</h5>
          ) : (
            <>
              <button type="submit" className="btn btn-primary">
                Guardar
              </button>
              <button
                className="btn btn-danger text-white"
                onClick={handleCancelEdit}
              >
                Cancelar
              </button>
            </>
          )}
        </li>
        {errors && errors.description && errors.description.message && (
          <Error error={errors.description.message} />
        )}
      </form>
      <ConfirmationModal
        show={showModal}
        message="¿Estás seguro que deseas borrar la anomalía?"
        onConfirm={() => destroyAnomaly(id)}
        onCancel={() => setShowModal(false)}
      />
    </>
  );
};
