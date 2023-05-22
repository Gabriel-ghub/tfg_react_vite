import React, { useEffect, useState } from "react";
import { SelectCourse } from "./SelectCourse";
import useHttp from "../../hooks/useHttp";
import { useToken } from "../../hooks/useToken";
import { BASE_URL } from "../../api/api";
import { Loader } from "../../components/Loader";
import DataTable from "react-data-table-component";
import Select from 'react-select'
export const ManageWork = ({ work }) => {
  const [courses, setCourses] = useState([]);
  const { isLoading, error, sendRequest } = useHttp();
  const [courseId, setCourseId] = useState(null);
  const { getToken } = useToken();
  const [assignedStudents, setAssignedStudent] = useState([]);
  const [notAssignedStudents, setNotAssignedStudent] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const url_courses = `${BASE_URL}/courses`;
      try {
        const token = getToken();
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };
        const response = await sendRequest(url_courses, "GET", null, headers);
        const results_courses = response.map(el => {
          return {value:el.id, label : `${el.name} ${el.year}`}
        })
        setCourses(results_courses);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setAssignedStudent([])
    setNotAssignedStudent([])
  }, [work]);

  const handleGetStudents = async (data) => {
    let {value} = data
    const url_students = `${BASE_URL}/work/${work.id}/course/${value}`;
    try {
      const token = getToken();
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
      const response = await sendRequest(url_students, "GET", null, headers);
      const assigned = response.ASSIGNED.map(el => {
        return { value: el.id, label: `${el.name} ${el.surname}` }
      })
      const notAssigned = response.NOT_ASSIGNED.map(el => {
        return { value: el.id, label: `${el.name} ${el.surname}` }
      })
      setAssignedStudent(assigned)
      setNotAssignedStudent(notAssigned)
    } catch (e) {
    }
  }

  const handleAttachStudent = async (e, student_id) => {
    const url = `${BASE_URL}/work/attach`
    const token = getToken();
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json"
    }
    const body = {
      user_id: student_id,
      work_id: work.id
    }
    try {
      const response = await sendRequest(url, "POST", JSON.stringify(body), headers)
      const newAssignedStudents = notAssignedStudents.filter((stu) => stu.id === student_id)[0]
      const tempNot_assignedStudents = notAssignedStudents.filter((stu) => stu.id !== student_id)
      setAssignedStudent([...assignedStudents, newAssignedStudents])
      setNotAssignedStudent(tempNot_assignedStudents)
    } catch (error) {
    }
  }

  const handleDettachStudent = async (event, student_id) => {

    const url = `${BASE_URL}/work/dettach`
    const token = getToken();
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json"
    }
    const body = {
      user_id: student_id,
      work_id: work.id
    }
      const response = await sendRequest(url, "PATCH", JSON.stringify(body), headers)
      if(response){
        const dettachStudent = assignedStudents.filter((stu) => stu.id === student_id)[0]
        const temp_assignedStudents = assignedStudents.filter((stu) => stu.id !== student_id)
        setAssignedStudent(temp_assignedStudents)
        setNotAssignedStudent([...notAssignedStudents, dettachStudent])
      }else{
        console.log("error al desasignar")
      }

  }

  const columns_assigned = [
    {
      name: "Nombre",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Apellido",
      selector: (row) => row.surname,
      sortable: true,
    },
    {
      name: "Acción",
      selector: (row) => {
        return (
          <button className="btn" onClick={(event) => handleDettachStudent(event, row.id)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="red" className="bi bi-dash-circle-fill" viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1h-7z" />
            </svg>
          </button>
        );
      },
    },
  ];

  const columns_not_assigned = [
    {
      name: "Nombre",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Apellido",
      selector: (row) => row.surname,
      sortable: true,
    },
    {
      name: "Acción",
      selector: (row) => {
        return (
          <button className="btn" onClick={(e) => handleAttachStudent(e, row.id)}>
            <svg
              className="cursor-pointer"
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              fill="#027373"
              viewBox="0 0 16 16"
            >
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
            </svg>
          </button>
        );
      },
    },
  ];

  const handleChange = (e) => {
  }

  return (
  
    <>
      <div className="col-12 pb-4 my-4 border-bottom border-start border-end shadow">
        {courses.length > 0 && (
              <Select options={courses} onChange={handleGetStudents}/>
         )}
        {(notAssignedStudents.length > 0 || assignedStudents.length > 0) && <div className="col-12 col-md-6"><Select onChange={handleChange} defaultValue={assignedStudents} isMulti options={notAssignedStudents} /> </div>}
      </div>
    </>
  );
};