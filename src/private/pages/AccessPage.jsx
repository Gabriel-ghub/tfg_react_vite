import React, { useEffect, useState } from "react";
import { Main } from "../components/global/Main";
import { FormAddTeacher } from "../components/FormAddTeacher";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import useHttp from "../../hooks/useHttp";
import { BASE_URL } from "../../api/api";
import { useToken } from "../../hooks/useToken";
import { Loader } from "../../components/Loader";
import { FormEditAdmin } from "../components/FormEditAdmin";

export const AccessPage = () => {
  const [teachers, setTeachers] = useState([]);
  const { isLoading, sendRequest, error } = useHttp();
  const { getToken } = useToken();
  useEffect(() => {
    const getTeachers = async () => {

        const token = getToken();
        const url = `${BASE_URL}/teachers`;
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
        const response = await sendRequest(url, "GET", null, headers);
        if(response){
          setTeachers(response);
        }else{
          alert("Hubo un error en la petición, contacte con el administrador")
        }
    };
    getTeachers();
  }, []);

  const columns = [
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Nombre",
      selector: (row) => row.name,
      sortable: true,
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
    <Main page={"teachers_page"}>
      <Link className="btn btn-primary" to={"/orders"}>Volver</Link>
      {/* <div className="row mt-5 text-center rounded">
         <h2>Listado de profesores</h2>
        <div className="col-12 shadow-lg p-4">
          {isLoading ? (
            <Loader />
          ) : (
            <DataTable columns={columns} data={teachers} pagination />
          )}
        </div>
      </div>  */}
      <div className="row mt-5 text-center rounded">
        <h3>Cambiar los datos de acceso</h3>
        <div className="col-12 d-flex justify-content-center shadow-lg p-4">
          <FormEditAdmin />
        </div>
      </div>
      {/* <div className="row mt-5">
        <div className="col-12 p-4 shadow-lg text-center rounded">
          <h2>Añadir profesores</h2>
          <FormAddTeacher setTeachers={setTeachers} />
        </div>
      </div> */}
    </Main>
  );
};
