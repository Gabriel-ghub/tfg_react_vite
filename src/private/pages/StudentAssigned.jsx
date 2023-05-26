import React, { useState, useEffect } from "react";
import { useFetcher, useParams } from "react-router-dom";
import { Main } from "../components/global/Main";
import useHttp from "../../hooks/useHttp";
import { BASE_URL } from "../../api/api";
import { useToken } from "../../hooks/useToken";
import Select from "react-select";
import { Loader } from "../../components/Loader";
export const StudentAssigned = ({ order }) => {
  const order_id = order;
  // // PARAMETRO
  // const { work_id } = useParams();
  // // ESTADOS
  const [loading, setLoading] = useState(false);
  // const [work, setWork] = useState(false)
  const [works, setWorks] = useState(false);
  const [assignedStudents, setAssignedStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [notAssignedStudents, setNotAssignedStudent] = useState([]);
  const [optionsNotAssigned, setOptionsNotAssigned] = useState([]);
  const [courseSearch, setCourseSearch] = useState();
  const [newStudents, setNewStudents] = useState("");
  // // CUSTOM HOOKS
  const { sendRequest, isLoading, error, clearError } = useHttp();
  const { getToken } = useToken();

  useEffect(() => {
    const fetchData = async () => {
      const url_courses = `${BASE_URL}/courses`;
      const url_get_works = `${BASE_URL}/order/${order_id}/students`;
      const token = getToken();
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      const studentAssigned = await sendRequest(
        url_get_works,
        "GET",
        null,
        headers
      );
      if (studentAssigned) {
        setAssignedStudents(studentAssigned);
      }
      const result_courses = await sendRequest(
        url_courses,
        "GET",
        null,
        headers
      );
      if (result_courses) {
        const courses = result_courses.map((each) => {
          return { label: `${each.name} ${each.year}`, value: each.id };
        });
        setCourses(courses);
      }
    };
    fetchData();
  }, []);

  const handleGetStudents = async (data) => {
    if (data) {
      setCourseSearch(data.label);
      let { value } = data;
      const url_students = `${BASE_URL}/order/${order_id}/course/${value}`;

      const token = getToken();
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      const response = await sendRequest(url_students, "GET", null, headers);
      if (response) {
        const assigned = response.ASSIGNED.map((el) => {
          return { value: el.id, label: `${el.name} ${el.surname}` };
        });
        const notAssigned = response.NOT_ASSIGNED.map((el) => {
          return { value: el.id, label: `${el.name} ${el.surname}` };
        });
        setNotAssignedStudent(response.NOT_ASSIGNED);
        setOptionsNotAssigned(notAssigned);
      }
    } else {
      setOptionsNotAssigned([]);
    }
  };

  const handleAttach = async () => {
    if (!newStudents || newStudents.length < 1) {
      return;
    }
    const students = newStudents.map((each) => each.value);
    const url = `${BASE_URL}/order/attach`;
    const token = getToken();
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    };
    const body = {
      user_ids: students,
      order_id: order_id,
    };
    const response = await sendRequest(
      url,
      "POST",
      JSON.stringify(body),
      headers
    );
    if (response) {
      const newStudents = notAssignedStudents
        .filter((each) => students.includes(each.id))
        .map((each) => {
          return {
            name: `${each.name}`,
            surname: `${each.surname}`,
            id: each.id,
            course_name: courseSearch,
            description: "",
          };
        });
      const studentsRemove = optionsNotAssigned.filter(
        (each) => !students.includes(each.value)
      );
      setOptionsNotAssigned(studentsRemove);
      setAssignedStudents([...assignedStudents, ...newStudents]);
      setNewStudents([]);
    }
    // const newAssignedStudents = notAssignedStudents.filter((stu) => stu.id === student_id)[0]
    // const tempNot_assignedStudents = notAssignedStudents.filter((stu) => stu.id !== student_id)
    // setAssignedStudent([...assignedStudents, newAssignedStudents])
    // setNotAssignedStudent(tempNot_assignedStudents)
  };

  const handleDettach = async (e, student_id) => {
    setLoading({ value: true, id: student_id });
    const url = `${BASE_URL}/order/dettach`;
    const token = getToken();
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    };
    const body = {
      user_id: student_id,
      order_id: order_id,
    };
    const response = await sendRequest(
      url,
      "PATCH",
      JSON.stringify(body),
      headers
    );
    if (response) {
      const newAssigned = assignedStudents.filter(
        (each) => each.id !== student_id
      );
      setAssignedStudents(newAssigned);
      setCourseSearch(null);
    }
    setLoading(false);
  };

  return (
    <div className="row mt-5">
      <h3 className="text-center">Alumnos</h3>
      <div className="shadow-lg border p-4 border-1 rounded">
        <div className="col-xs-12 col-md-12 p-2">
          {assignedStudents.length > 0
            ? assignedStudents.map((each) => {
                return (
                  <div className="d-flex gap-3 mb-2">
                    <div
                      className="form-control"
                      style={{ backgroundColor: "#e9ecef" }}
                    >
                      {each.name} {each.surname} ({each.course_name} {each.year}
                      )
                    </div>
                    {loading && loading.id == each.id ? (
                      <Loader />
                    ) : (
                      <button
                        className="btn btn-danger text-white"
                        onClick={(e) => handleDettach(e, each.id)}
                      >
                        Quitar
                      </button>
                    )}
                  </div>
                );
              })
            : "Esta orden no tiene alumnos asignados"}
        </div>
        <div className="p-2">
          <h5 className="mb-4">Añadir alumnos</h5>

          <h6>Selecciona el curso</h6>
          {courses.length > 0 && (
            <Select
              isClearable
              onChange={handleGetStudents}
              options={courses}
            />
          )}
          {courseSearch && <h6 className="mt-3">Selecciona los alumnos</h6>}
          {isLoading && <Loader />}
          {optionsNotAssigned.length > 0 && (
            <Select
              isMulti
              value={newStudents}
              onChange={(choice) => setNewStudents(choice)}
              options={optionsNotAssigned}
            />
          )}
          {newStudents && newStudents.length > 0 && (
            <div className="col-12 d-flex justify-content-center mt-3">
              <button className="btn btn-primary" onClick={handleAttach}>
                Guardar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
