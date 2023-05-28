import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useHttp from "../../hooks/useHttp";
import { useToken } from "../../hooks/useToken";
import { FormEditCourse } from "../components/FormEditCourse";
import { Loader } from "../../components/Loader";
import { BASE_URL } from "../../api/api";

;
export const CourseDetails = () => {
  const navigate = useNavigate();
  const { course_id } = useParams();
  const [course, setCourse] = useState(false);
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
      } else {
        navigate("/courses");
      }
    };
    getCourse();
  }, []);

  return (
    <>
      {isLoading && <Loader />}
      {course && (
        <div className="container">
          <Link className="btn btn-primary mt-5" to="/courses">
            Volver
          </Link>
          <div className="row mt-5 ">
            <h3 className="text-center">Editar datos del curso</h3>
            <div className="col-12 p-4 shadow-lg d-flex justify-content-center">
              <FormEditCourse course={course} setCourse={setCourse} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
