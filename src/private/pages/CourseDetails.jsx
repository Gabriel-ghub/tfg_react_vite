import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Link, useParams } from "react-router-dom";
import useHttp from "../../hooks/useHttp";
import { useToken } from "../../hooks/useToken";
import { FormEditCourse } from "../components/FormEditCourse";
import { Loader } from "../../components/Loader";
import { BASE_URL } from "../../api/api";

const initialForm = {
  name: "",
  year: "",
};
export const CourseDetails = () => {
  const { course_id } = useParams();
  const [course, setCourse] = useState(initialForm);
  const [students, setStudents] = useState([]);
  const { getToken } = useToken();
  const { isLoading, sendRequest } = useHttp();

  useEffect(() => {
    const getCourse = async () => {
      try {
        const url = `${BASE_URL}/course/${course_id}`;
        const token = getToken();
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        const response = await sendRequest(url, "GET", null, headers);
        setCourse(response);
      } catch (error) {
        console.log(error);
      }
    };
    const getStudents = async () => {
      try {
        const url = `${BASE_URL}/course/${course_id}/students`;
        const token = getToken();
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        const response = await sendRequest(url, "GET", null, headers);
        setStudents(response);
      } catch (error) {
        console.log(error);
      }
    };
    getCourse();
    getStudents();
  }, [course_id]);

  const columns = [
    {
      name: "Nombre",
      selector: (row) => row.name,
    },
    {
      name: "apellido",
      selector: (row) => row.surname,
    },
    {
      name: "Detalle",
      selector: (row) => {
        return (
          <Link className="btn btn-warning" to={`/course/${row.id}/detail`}>
            Detalle
          </Link>
        );
      },
    },
  ];

  const handleChange = (state) => {
    console.log(state.selectedRows);
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="container">
          <div className="row mt-5 shadow-lg py-3">
            <div className="col-12 d-flex justify-content-center">
              <FormEditCourse course={course} setCourse={setCourse} />
            </div>
            {students.length > 0 && (
              <div className="col-12 py-3 mt-2">
                <h3>Alumnos matriculados</h3>
                <DataTable
                  columns={columns}
                  data={students}
                  selectableRows
                  onSelectedRowsChange={handleChange}
                  pagination
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
