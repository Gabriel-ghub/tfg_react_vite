import React, { useState } from "react";
import useHttp from "../../hooks/useHttp";
import { useToken } from "../../hooks/useToken";
import { SelectCourse } from "./SelectCourse";
import { Error } from "../../components/Error";
import { BASE_URL } from "../../api/api";
import Select  from "react-select";
const url_csv = `${BASE_URL}/user/createCSV`;
export const FormAddStudentsCSV = ({ options }) => {
  const { sendRequest, isLoading, error, clearError } = useHttp();
  const { getToken } = useToken();
  const [file, setFile] = useState(null);
  const [courseId, setCourseId] = useState(null);
  const [success, setSuccess] = useState(false);
  const [errorCSV, setErrorCSV] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (courseId == null || file == null) {
      setErrorCSV("Debe seleccionar un curso y un archivo CSV");
      return;
    }
    setErrorCSV(false);
    const token = getToken();
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const body = new FormData();
    body.append("csv", file);
    body.append("course_id", courseId);

    const response = await sendRequest(url_csv, "POST", body, headers);
    if (response) {
      setSuccess("Alumnos añadidos con éxito");
    }
  };
   const handleSelect = (selectedOption) => {
    setCourseId(selectedOption.value);
   }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-12 col-md-6">
            <label className="form-label">Archivo CSV:</label>
            <input
              type="file"
              className="form-control"
              onChange={(event) => setFile(event.target.files[0])}
            />
          </div>
          <Select options={options}/>
        </div>
        {success && (
          <div class="alert alert-info mt-3" role="alert">
            {success}
          </div>
        )}
        {errorCSV && <Error error={errorCSV}/>}
        {error &&
          Array.isArray(error) &&
          error.map((each, index) => (
            <Error error={each.message} clearError={clearError} />
          ))}
        <div className="col-12 text-center mt-5">
          <button type="submit" className="btn btn-primary ">
            Agregar
          </button>
        </div>
      </form>
    </>
  );
};
