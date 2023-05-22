import React, { useEffect, useState } from "react";
import { Main } from "../components/global/Main";
import { useParams } from "react-router-dom";
import useHttp from "../../hooks/useHttp";
import { BASE_URL } from "../../api/api";
import { useToken } from "../../hooks/useToken";
import { FormEditUser } from "../components/FormEditUser";
import { Loader } from "../../components/Loader";

export const TeacherDetails = () => {
  const { teacher_id } = useParams();
  const { isLoading, sendRequest, error, clearError } = useHttp();
  const { getToken } = useToken();
  const [user, setUser] = useState(false);
  const [courses, setCourses] = useState(false);

  useEffect(() => {
    const getUserAndCourses = async () => {
      const token = getToken();
      const url_courses = `${BASE_URL}/courses`;
      const url = `${BASE_URL}/user/${student_id}`;
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const response = await sendRequest(url, "GET", null, headers);
      if (response) {
        setUser(response);
      }
      const response_courses = await sendRequest(
        url_courses,
        "GET",
        null,
        headers
      );
      if (response_courses) {
        setCourses(response_courses);
      }
    };
    getUserAndCourses();
  }, []);

  return (
    <Main page={"student_details_page"}>
      {isLoading && <Loader />}
      {user && courses && <FormEditUser user={user} />}
    </Main>
  );
};
