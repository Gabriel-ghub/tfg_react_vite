import React, { useEffect, useState } from "react";
import { FormAddStudents } from "../components/FormAddStudents";
import { FormAddStudentsCSV } from "../components/FormAddStudentsCSV";
import { Main } from "../components/global/Main";
import useHttp from "../../hooks/useHttp";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import { Loader } from "../../components/Loader";
import { BASE_URL } from "../../api/api";
import { useToken } from "../../hooks/useToken";
import Select from "react-select";

const initialForm = [];

const url_courses = `${BASE_URL}/courses`;
export const StudentsPage = () => {
  const [courses, setCourses] = useState(initialForm);
  const { isLoading, sendRequest } = useHttp();
  const [courseId, setCourseId] = useState(false);
  const [students, setStudents] = useState([]);
  const [options, setOptions] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const { getToken } = useToken();

  useEffect(() => {
    const fetchData = async () => {
      const token = JSON.parse(localStorage.getItem("token"));
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const response = await sendRequest(url_courses, "GET", null, headers);
      if (response) {
        const options = response.map((course) => {
          return { value: course.id, label: `${course.name}(${course.year})` };
        });
        setOptions(options);
      }
    };
    fetchData();
  }, []);

  const handleSetCourse = async (course_id) => {
    const url = `${BASE_URL}/course/${course_id}/students`;
    const token = getToken();
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    const response = await sendRequest(url, "GET", null, headers);
    if (response) {
      setStudents(response);
    }
    setCourseId(course_id);
  };

  const columns = [
    {
      name: "Nombre",
      selector: (row) => row.name,
    },
    {
      name: "email",
      selector: (row) => row.email,
    },
    {
      name: "Editar datos",
      selector: (row) => {
        return (
          <Link className="btn btn-primary" to={`/student/${row.id}/detail`}>
            Editar
          </Link>
        );
      },
    },
  ];

  const handleSelect = (data) => {
    setSelectedOption(data);
    setCourseId(data.value);
    handleSetCourse(data.value);
  };

  const resetSelect = () => {
    setSelectedOption(null);
  };
  return (
    <Main page={"students_page"}>
      <div className="row mt-5">
        <h2 className="text-center">Listado de alumnos</h2>
        <div className=" shadow-lg p-4">
          <div className="col-12 col-md-6 p-2">
            <Select
              className=""
              options={options}
              onChange={handleSelect}
              value={selectedOption}
            />
            {isLoading && <Loader />}
            {courseId && !isLoading && students.length < 1 && (
              <div>Este curso no tiene estudiantes</div>
            )}
          </div>
          <div className="col-12">
            {courseId && !isLoading && students.length > 0 && (
              <DataTable columns={columns} data={students} pagination />
            )}
          </div>
        </div>
      </div>

      <div className="row mt-5">
        <h2 className="text-center">Agregar nuevo alumno</h2>
        {isLoading && <Loader />}
        {!isLoading && options.length < 1 && <p className="text-center">Primero debe crear un curso.</p>}
        {options.length > 0 && (
          <div className="mb-3 col-12 shadow-lg p-4">
            <div
              className="accordion accordion-flush"
              id="accordionFlushExample"
            >
              <div className="accordion-item">
                <h2 className="accordion-header" id="flush-headingOne">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#flush-collapseOne"
                    aria-expanded="false"
                    aria-controls="flush-collapseOne"
                  >
                    Datos
                  </button>
                </h2>
                <div
                  id="flush-collapseOne"
                  className="accordion-collapse collapse"
                  aria-labelledby="flush-headingOne"
                  data-bs-parent="#accordionFlushExample"
                >
                  <div className="accordion-body">
                    {options.length > 0 ? (
                      <FormAddStudents options={options}></FormAddStudents>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className="accordion-item">
                <h2 className="accordion-header" id="flush-headingTwo">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#flush-collapseTwo"
                    aria-expanded="false"
                    aria-controls="flush-collapseTwo"
                  >
                    Mediante fichero CSV
                  </button>
                </h2>
                <div
                  id="flush-collapseTwo"
                  className="accordion-collapse collapse"
                  aria-labelledby="flush-headingTwo"
                  data-bs-parent="#accordionFlushExample"
                >
                  <div className="accordion-body">
                    {options.length > 0 ? (
                      <FormAddStudentsCSV
                        options={options}
                      ></FormAddStudentsCSV>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Main>
  );
};
