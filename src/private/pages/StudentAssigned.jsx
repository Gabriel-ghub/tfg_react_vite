import React, { useState, useEffect } from "react";
import useHttp from "../../hooks/useHttp";
import { BASE_URL } from "../../api/api";
import { useToken } from "../../hooks/useToken";
import Select from "react-select";
import { Loader } from "../../components/Loader";
import { Error } from "../../components/Error";
import { Link } from "react-router-dom";
export const StudentAssigned = ({ order }) => {
  const order_id = order;
  // // ESTADOS
  const [loading, setLoading] = useState(false);
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
        {!isLoading && courses.length < 1 && (
          <p>
            Para asignar alumnos primero debe{" "}
            <Link to={"/courses"}>crear un curso.</Link>
          </p>
        )}
        {isLoading && !courseSearch && <Loader />}
        {courses.length > 0 && (
          <>
            <div className="p-2">
              {assignedStudents.length > 0 && <h5>Alumnos asignados</h5>}
              {assignedStudents.length < 1 && (
                <p>Esta orden no tiene alumos asignados</p>
              )}
              {assignedStudents.length > 0 &&
                assignedStudents.map((each) => {
                  return (
                    <li
                      key={each.id}
                      className="d-flex flex-column flex-md-row gap-3 mb-2"
                    >
                      <p
                        className="flex-grow-1 mb-0 rounded p-2"
                        style={{ backgroundColor: "#e9ecef" }}
                      >
                        {each.name} {each.surname} ({each.course_name}{" "}
                        {each.year})
                      </p>
                      {loading && loading.id == each.id ? (
                        <Loader />
                      ) : (
                        <div className="d-flex gap-1">
                          <button
                            className="btn btn-danger text-white"
                            onClick={(e) => handleDettach(e, each.id)}
                          >
                            Quitar
                          </button>
                        </div>
                      )}
                    </li>
                  );
                })}
            </div>

            <div className="p-2">
              <h5 className="mb-4">Añadir alumnos</h5>
              <h6>Selecciona el curso</h6>
              <Select
                isClearable
                onChange={handleGetStudents}
                options={courses}
              />
            </div>
            {/* {courseSearch && <h6 className="mt-3">Selecciona los alumnos</h6>} */}
            {courseSearch && isLoading && <Loader />}
            {courseSearch && !isLoading && optionsNotAssigned.length > 0 && (
              <div className="p-2">
                <h6 className="">Selecciona los alumnos</h6>
                <Select
                  isMulti
                  value={newStudents}
                  onChange={(choice) => setNewStudents(choice)}
                  options={optionsNotAssigned}
                />
              </div>
            )}
            {courseSearch &&
              !isLoading &&
              optionsNotAssigned.length < 1 &&
              assignedStudents.length < 1 && (
                <div className="p-2">
                  <p>
                    Este curso no tiene alumnos o todos los alumnos han sido
                    asignados previamente.{" "}
                    <Link to={"/students"}>Añadir alumnos.</Link>
                  </p>
                </div>
              )}
            {courseSearch &&
              !isLoading &&
              optionsNotAssigned.length < 1 &&
              assignedStudents.length > 0 && (
                <div className="p-2">
                  <p>
                    Este curso no tiene alumnos o todos los alumnos han sido
                    asignados previamente.{" "}
                    <Link to={"/students"}>Añadir alumnos.</Link>
                  </p>
                </div>
              )}
            {newStudents && newStudents.length > 0 && (
              <div className="col-12 d-flex justify-content-center mt-3">
                <button className="btn btn-primary" onClick={handleAttach}>
                  Guardar
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
