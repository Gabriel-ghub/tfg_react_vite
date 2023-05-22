import React, { useEffect, useState } from "react";
import { Loader } from "../../components/Loader";
import useHttp from "../../hooks/useHttp";
import { useToken } from "../../hooks/useToken";
import { BASE_URL } from "../../api/api";
import { useNavigate } from "react-router-dom";
import { validationType } from "../../validations/validator";
const initialForm = {
  name: "",
  year: "",
};
export const FormEditCourse = ({ course, setCourse }) => {
  const [editCourse, setEditCourse] = useState(initialForm);
  const [isEdit, setisEdit] = useState(false);
  const { getToken } = useToken();
  const { isLoading, sendRequest, error } = useHttp();
  const navigate = useNavigate();
  useEffect(() => {
    setEditCourse(course);
  }, [course]);

  const onInputChange = (e) => {
    e.preventDefault();
    if (
      e.target.name == "name" &&
      !(
        validationType["text"](e.target.value) &&
        validationType["length"](e.target.value, 30)
      )
    ) {
      return false;
    }
    if (
      e.target.name == "year" &&
      !(
        validationType["number"](e.target.value) &&
        validationType["length"](e.target.value, 20)
      )
    ) {
      return false;
    }

    setEditCourse({ ...editCourse, [e.target.name]: e.target.value });
  };

  const startEdit = (e) => {
    e.preventDefault();
    setisEdit(true);
  };

  const cancelEdit = (e) => {
    e.preventDefault();
    setEditCourse(course);
    setisEdit(false);
  };

  const confirmEdit = async (id) => {
    const token = getToken();
    const url = `${BASE_URL}/course/${id}/update`;
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    const body = {
      id,
      name: editCourse.name,
      year: editCourse.year,
    };

    const response = await sendRequest(
      url,
      "PUT",
      JSON.stringify(body),
      headers
    );
    if (response) {
      setisEdit(false);
      setCourse(response.data);
    }
  };

  const deleteCourse = async (id) => {
    e.preventDefault();
    const token = getToken();
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    const body = {
      id,
    };
    const response = await sendRequest(
      `${BASE_URL}/courses`,
      "DELETE",
      JSON.stringify(body),
      headers
    );
    if (response) {
      navigate(`/courses`);
    }
  };
  return (
    <>
      <form className="col-12 col-md-6">
        <label className="form-label" htmlFor="name">
          Nombre
        </label>
        {isEdit ? (
          <input
            id="name"
            type="text"
            className="form-control border-success"
            name="name"
            value={editCourse.name}
            onChange={onInputChange}
            disabled={!isEdit}
          />
        ) : (
          <div className="form-control" style={{ backgroundColor: "#e9ecef" }}>
            {editCourse.name || ""}
          </div>
        )}
        <label className="form-label" htmlFor="year">
          Año
        </label>
        {isEdit ? (
          <input
            id="year"
            type="text"
            name="year"
            className="form-control border-success"
            value={editCourse.year}
            onChange={onInputChange}
          />
        ) : (
          <div className="form-control" style={{ backgroundColor: "#e9ecef" }}>
            {editCourse.year || ""}
          </div>
        )}
        <div className="d-flex justify-content-center mt-3 gap-3">
          {isLoading ? (
            <Loader />
          ) : isEdit ? (
            <>
              <button
                className="btn btn-primary"
                onClick={(e) => confirmEdit(editCourse.id)}
              >
                Guardar
              </button>
              <button className="btn btn-danger" onClick={cancelEdit}>
                Cancelar
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-primary" onClick={startEdit}>
                Editar
              </button>
              <button
                className="btn btn-danger text-light"
                onClick={(e) => deleteCourse(e,course.id)}
              >
                Borrar
              </button>
            </>
          )}
        </div>
      </form>
    </>
  );
};
