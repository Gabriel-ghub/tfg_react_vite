import React, { useEffect, useState } from "react";
import useHttp from "../../hooks/useHttp";
import { Main } from "../components/global/Main";
import { OrderTable } from "../components/OrderTable";
import { OrderContext } from "../context/OrderContext/OrderContext";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import { FormAddCourse } from "../components/FormAddCourse";
import { Loader } from "../../components/Loader";
import { BASE_URL } from "../../api/api";
const url_courses = `${BASE_URL}/courses`;

export const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const { isLoading, error, sendRequest, clearError } = useHttp();

  useEffect(() => {
    const fetchData = async () => {
      const token = JSON.parse(localStorage.getItem("token"));
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      const response = await sendRequest(url_courses, "GET", null, headers);
      if (response) {
        setCourses(response);
      }
    };
    fetchData();
  }, []);

  const columns = [
    {
      name: "Nombre",
      selector: (row) => row.name,
    },
    {
      name: "Año",
      selector: (row) => row.year,
    },
    {
      name: "Detalle",
      selector: (row) => {
        return (
          <Link className="btn btn-warning" to={`/course/${row.id}/detail`}>
            Editar
          </Link>
        );
      },
    },
  ];

  return (
    <Main page={"courses"}>
      <div className="container mb-5">
        <div className="row mt-5">
          <h2 className="text-center">Lista de cursos</h2>
          <div className="p-4 shadow-lg">
            {isLoading && <Loader></Loader>}
            {courses.length > 0 && (
              <DataTable columns={columns} data={courses} pagination />
            )}
            {courses.length < 1 && !isLoading && <div>Aún no tiene ningun curso creado</div>}
          </div>
        </div>
        <div className="row mt-5 mb-5">
          <h2 className="text-center">Crea un nuevo curso</h2>
          <div className="col-12 shadow-lg p-4 d-flex justify-content-center">
            <FormAddCourse courses={courses} setCourses={setCourses} />
          </div>
        </div>
      </div>
    </Main>
  );
};
