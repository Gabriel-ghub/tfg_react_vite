import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Link, useNavigate, useParams } from "react-router-dom";
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
  const navigate = useNavigate();
  const { course_id } = useParams();
  const [course, setCourse] = useState(initialForm);
  const [students, setStudents] = useState([]);
  const { getToken } = useToken();
  const { isLoading, sendRequest } = useHttp();

  useEffect(() => {
    const getCourse = async () => {
      const url = `${BASE_URL}/course/${course_id}`;
      const token = getToken();
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      const response = await sendRequest(url, "GET", null, headers);
      if (response) {
        setCourse(response);
      }else{
        navigate("/courses")
      }
    };
    const getStudents = async () => {
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
          <Link className="btn btn-warning" to={`/user/${row.id}/detail`}>
            Detalle
          </Link>
        );
      },
    },
  ];



  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="container">
          <Link className="btn btn-primary mt-5" to="/courses">Volver</Link>
          <div className="row mt-5 shadow-lg py-3">
            <div className="col-12 d-flex justify-content-center">
              <FormEditCourse course={course} setCourse={setCourse} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
