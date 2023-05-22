import React, { useState, useEffect } from 'react'
import { useFetcher, useParams } from 'react-router-dom'
import { Main } from '../components/global/Main';
import useHttp from '../../hooks/useHttp';
import { BASE_URL } from '../../api/api';
import { useToken } from '../../hooks/useToken';
import Select from 'react-select'
import { Loader } from '../../components/Loader';
export const StudentAssigned = ({ order }) => {
    const order_id = order;
    // // PARAMETRO
    // const { work_id } = useParams();
    // // ESTADOS
    const [loading, setLoading] = useState(false)
    // const [work, setWork] = useState(false)
    const [works, setWorks] = useState(false)
    const [assignedStudents, setAssignedStudents] = useState([])
    const [courses, setCourses] = useState([]);
    const [notAssignedStudents, setNotAssignedStudent] = useState([]);
    const [optionsNotAssigned, setOptionsNotAssigned] = useState([])
    const [courseSearch, setCourseSearch] = useState()
    const [newStudents, setNewStudents] = useState("")
    // // CUSTOM HOOKS
    const { sendRequest, isLoading, error, clearError } = useHttp();
    const { getToken } = useToken();
    // //URLS

    // useEffect(() => {
    //     const url_assigned_students = `${BASE_URL}/work/${work_id}/students`
    //     const url_work_information = `${BASE_URL}/works/${work_id}`
    //     const url_courses = `${BASE_URL}/courses`;
    //     const fetchInitialData = async () => {
    //         const token = getToken()
    //         const headers = {
    //             Authorization: `Bearer ${token}`,
    //             "Content-Type": "application/json",
    //         };
    //         const result_students = await sendRequest(url_assigned_students, "GET", null, headers)
    //         console.log(result_students)
    //         if (result_students) {
    //             const students = result_students.map(each => {
    //                 return {
    //                     name: `${each.name} ${each.surname}`,
    //                     id: each.id,
    //                     course: `${each.course} ${each.year}`,
    //                     description: each.pivot.description
    //                 }
    //             })
    //             setAssigned(students)
    //         }
    //         const result_work = await sendRequest(url_work_information, "GET", null, headers)
    //         if (result_work) {
    //             console.log(result_work)
    //             setWork(result_work)
    //         }
    //         const result_courses = await sendRequest(url_courses, "GET", null, headers)
    //         if (result_courses) {
    //             const courses = result_courses.map(each => {
    //                 return { label: `${each.name} ${each.year}`, value: each.id }
    //             })
    //             setCourses(courses)
    //         }
    //     }
    //     fetchInitialData()
    // }, [work_id])
    useEffect(() => {
        const fetchData = async () => {
            const url_courses = `${BASE_URL}/courses`;
            const url_get_works = `${BASE_URL}/order/${order_id}/students`
            const token = getToken()
            const headers = {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            }
            const studentAssigned = await sendRequest(url_get_works, "GET", null, headers)
            if (studentAssigned) {
                setAssignedStudents(studentAssigned)
            }
            const result_courses = await sendRequest(url_courses, "GET", null, headers)
            if (result_courses) {
                const courses = result_courses.map(each => {
                    return { label: `${each.name} ${each.year}`, value: each.id }
                })
                setCourses(courses)
            }
        }
        fetchData();
    }, [])

    const handleGetStudents = async (data) => {
        if (data) {
            setCourseSearch(data.label)
            let { value } = data
            const url_students = `${BASE_URL}/order/${order_id}/course/${value}`;
            try {
                const token = getToken();
                const headers = {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
                const response = await sendRequest(url_students, "GET", null, headers);
                console.log(response)
                const assigned = response.ASSIGNED.map(el => {
                    return { value: el.id, label: `${el.name} ${el.surname}` }
                })
                const notAssigned = response.NOT_ASSIGNED.map(el => {
                    return { value: el.id, label: `${el.name} ${el.surname}` }
                })
                setNotAssignedStudent(response.NOT_ASSIGNED)
                setOptionsNotAssigned(notAssigned)
            } catch (e) {
                console.log(e)
            }
        } else {
            setOptionsNotAssigned([])
        }

    }

    const handleAttach = async () => {
        if (!newStudents || newStudents.length < 1) {
            console.log("cabio")
            return
        }
        const students = newStudents.map(each => each.value)
        console.log(students)
        const url = `${BASE_URL}/order/attach`
        const token = getToken();
        const headers = {
            Authorization: `Bearer ${token}`,
            "Content-type": "application/json"
        }
        const body = {
            user_ids: students,
            order_id: order_id
        }
        const response = await sendRequest(url, "POST", JSON.stringify(body), headers)
        if (response) {
            const newStudents = notAssignedStudents.filter(each => students.includes(each.id)).map(each => {
                return ({
                    name: `${each.name}`,
                    surname: `${each.surname}`,
                    id: each.id,
                    course_name: courseSearch,
                    description: ""
                })
            })
            const studentsRemove = optionsNotAssigned.filter(each => !students.includes(each.value))
            setOptionsNotAssigned(studentsRemove)
            setAssignedStudents([...assignedStudents, ...newStudents])
            setNewStudents([])
        }
        // const newAssignedStudents = notAssignedStudents.filter((stu) => stu.id === student_id)[0]
        // const tempNot_assignedStudents = notAssignedStudents.filter((stu) => stu.id !== student_id)
        // setAssignedStudent([...assignedStudents, newAssignedStudents])
        // setNotAssignedStudent(tempNot_assignedStudents)
    }

    const handleDettach = async (e, student_id) => {
        setLoading({ value: true, id: student_id })
        const url = `${BASE_URL}/order/dettach`
        const token = getToken();
        const headers = {
            Authorization: `Bearer ${token}`,
            "Content-type": "application/json"
        }
        const body = {
            user_id: student_id,
            order_id: order_id
        }
        const response = await sendRequest(url, "PATCH", JSON.stringify(body), headers)
        if (response) {
            console.log(response)
            const newAssigned = assignedStudents.filter(each => each.id !== student_id)
            console.log(newAssigned)
            setAssignedStudents(newAssigned)
            setCourseSearch(null)
        }
        setLoading(false)
    }

    // const handleDettach = async (e, student_id) => {
    //     setLoading({ value: true, id: student_id })
    //     e.preventDefault();
    //     console.log(student_id)
    //     const url = `${BASE_URL}/work/dettach`
    //     const token = getToken();
    //     const headers = {
    //         Authorization: `Bearer ${token}`,
    //         "Content-type": "application/json"
    //     }
    //     const body = {
    //         user_id: student_id,
    //         work_id: work_id
    //     }

    //     const response = await sendRequest(url, "PATCH", JSON.stringify(body), headers)
    //     if (response) {
    //         console.log(response)
    //         const newAssigned = assigned.filter(each => each.id !== student_id)
    //         console.log(newAssigned)
    //         setAssigned(newAssigned)
    //         setCourseSearch(null)
    //     }
    //     setLoading(false)
    // }




    return (

        <div className="row shadow-lg border py-3 border-1 rounded">
            <div className="col-xs-12 col-md-12 p-3">
                <h3 className='text-center'>Alumnos asignados</h3>
                {
                    assignedStudents.length > 0
                        ? (assignedStudents.map(each => {
                            return (
                                <div className='d-flex gap-3 mb-2'>
                                    <div className="form-control" style={{ backgroundColor: "#e9ecef" }}>
                                        {each.name} {each.surname} ({each.course_name} {each.year})
                                    </div>
                                    {(loading && loading.id == each.id)
                                        ? <Loader />
                                        : (<button className='btn btn-danger text-white' onClick={(e) => handleDettach(e, each.id)}>
                                            Quitar
                                        </button>)}

                                </div>
                            )
                        }))
                        : "Esta orden no tiene alumnos asignados"
                }
            </div>
            <h5 className='mb-4'>Añadir alumnos</h5>
            <h6>Selecciona el curso</h6>
            {courses.length > 0 && <Select isClearable onChange={handleGetStudents} options={courses} />}
            {courseSearch && <h6 className='mt-3'>Selecciona los alumnos</h6>}
            {optionsNotAssigned.length > 0 && <Select isMulti value={newStudents} onChange={(choice) => setNewStudents(choice)} options={optionsNotAssigned} />}
            {newStudents && newStudents.length > 0 &&
                <div className='col-12 d-flex justify-content-center mt-3'><button className='btn btn-primary' onClick={handleAttach}>Guardar</button></div>
            }
        </div>

    )

    //     return (
    //         <Main page={'work_details'}>
    //             <div className="row p-3 shadow-lg border border-1 rounded mt-4">
    //                 <div className="col-12">
    //                     <h2 className='bg-success mb-5'>{work.description}</h2>
    //                     <h3>Alumnos asignados</h3>
    //                     <div className="accordion accordion-flush" id="accordionFlushExample">
    //                         {assigned.map(student => {
    //                             return (
    //                                 <div key={student.id} className="accordion-item">
    //                                     <div className="d-flex align-items-center justify-content-between">
    //                                         <p className='d-flex align-items-center justify-content-between'>{student.name} ({student.course})
    //                                         </p>
    //                                         <div className="d-flex gap-2">
    //                                             <button className="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target={`#flush-collapse${student.id}`} aria-expanded="false" aria-controls="flush-collapseOne">
    //                                                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-down-fill" viewBox="0 0 16 16">
    //                                                     <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
    //                                                 </svg>
    //                                             </button>
    //                                             {
    //                                             (loading && loading.id == student.id)
    //                                                 ? <Loader />
    //                                                 : (<button className='btn btn-danger text-white' onClick={(e) => handleDettach(e, student.id)}>
    //                                                     Quitar
    //                                                 </button>)
    //                                             }

    //                                         </div>
    //                                     </div>
    //                                     <div id={`flush-collapse${student.id}`} className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
    //                                         <div className="accordion-body border-start border-end border-bottom">
    //                                             {student.description != ""
    //                                                 ? <><h4>Comentario del alumno:</h4>
    //                                                     <p>{student.description}</p></>
    //                                                 : <h4>Sin comentarios</h4>
    //                                             }
    //                                         </div>
    //                                     </div>
    //                                 </div>
    //                             )
    //                         })}
    //                     </div>
    //                 </div>
    //             </div>
    //             <div className="row p-3 shadow-lg border border-1 rounded mt-5">
    //                 <div className="col-12 col-md-6">
    //                     <h2 className="mb-5">Agregar alumnos</h2>
    //                     <h3>Selecciona el curso</h3>
    //                     {courses.length > 0 && <Select isClearable onChange={handleGetStudents} options={courses} />}
    //                     <h3 className='mt-3'>Selecciona los alumnos</h3>
    //                     {optionsNotAssigned.length > 0 && <Select isMulti value={newStudents} onChange={(choice) => setNewStudents(choice)} options={optionsNotAssigned} />}
    //                 </div>
    //                 <div className="col-12 d-flex justify-content-center mt-5">
    //                     {newStudents && newStudents.length > 0 &&
    //                         <button className='btn btn-primary' onClick={handleAttach}>Guardar</button>
    //                     }
    //                 </div>
    //             </div>
    //         </Main>
    //     )

}
