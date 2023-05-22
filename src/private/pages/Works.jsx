import React from "react";
import { Main } from "../components/global/Main";
import DataTable from "react-data-table-component";
import { Loader } from "../../components/Loader";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import useHttp from "../../hooks/useHttp";
import { useState } from "react";
import { Work } from "../components/Work";
import { BASE_URL } from "../../api/api";
import { useToken } from "../../hooks/useToken";
import { ManageWork } from "../components/ManageWork";

export const Works = ({ order_id }) => {
  const [works, setWorks] = useState([]);
  const [work, setWork] = useState("");
  // const { order_id } = useParams();
  const { isLoading, sendRequest, error, clearError } = useHttp();
  const { getToken } = useToken();
  const [isManaging, setIsManaging] = useState(false);
  const [workManaging, setWorkManaging] = useState(false)
  const [students, setStudents] = useState([])
  const [assignedStudents, setAssignedStudents] = useState([])

  useEffect(() => {
    const getWorks = async () => {
   
        const url = `${BASE_URL}/work/${order_id}`;
        const token = getToken();
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };
        const response = await sendRequest(url, "GET", null, headers);
        if(response){
          setWorks(response);
        }
    };
    getWorks();
    return () => { };
  }, []);

  const handleAddWork = async (e) => {
    e.preventDefault();
    if (work == "") return;
    const url = `${BASE_URL}/work/create`;
    const data = {
      order_id,
      description: work,
    };
    const body = JSON.stringify(data);
    const token = getToken();
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    const response = await sendRequest(url, "POST", body, headers);

    if (response) {
      setWork("");
      setWorks([...works, response]);
    }
  };

  const handleChange = (e) => {
    setWork(e.target.value);
  };

  const handleUpdateWork = (work) => {
    const newWorks = works.map((w) => {
      if (w.id === work.id) {
        return work;
      }
      return w;
    });
  };

  const handleDeteleWork = (response) => {
    const newWorks = works.filter((w) => w.id !== response.id);
    setWorks(newWorks);
  };

  const handleManage = async (e, id) => {
    const manageWork = works.find((w) => w.id === id);
    setIsManaging(true);
    setWorkManaging(manageWork)
    
    setTimeout(() => {
      window.scrollTo(0, document.body.scrollHeight);
    }, 100);
  };


  return (
    <>
      <div className="col-12 py-3 px-3 shadow-lg mb-5">
        <div className="row">
          <h5>Anomalías declaradas</h5>
        </div>
        {isLoading && <Loader />}
        {works.length > 0 ?
          (works.map((work) => (
            <Work
              handleUpdateWork={handleUpdateWork}
              handleDeteleWork={handleDeteleWork}
              handleManage={handleManage}
              workManaging={workManaging}
              key={work.id}
              work={work}
            ></Work>
          ))) : <p>Esta orden no tiene ningun trabajo asociado</p>}
        <div className="d-flex flex-column mt-3">
          <form className="form-group" onSubmit={handleAddWork}>
            <label className="required-field" htmlFor="message">
              ¿Quieres agregar mas trabajos?
            </label>
            <input
              type="text"
              className="form-control"
              name="work"
              value={work}
              onChange={handleChange}
              id="work"
              placeholder="Ejemplo: Cambiar luces"
            ></input>
            <button className="btn" type="submit" >
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
          </form>
        </div>
      </div>
    </>
  );
};
