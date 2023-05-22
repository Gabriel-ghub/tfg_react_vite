import React, { useEffect, useState } from "react";
import { Main } from "../components/global/Main";
import { FormAddTeacher } from "../components/FormAddTeacher";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import useHttp from "../../hooks/useHttp";
import { BASE_URL } from "../../api/api";
import { useToken } from "../../hooks/useToken";
import { Loader } from "../../components/Loader";

export const TeachersPage = () => {
  const [teachers, setTeachers] = useState([]);
  const { isLoading, sendRequest, error } = useHttp();
  const { getToken } = useToken();
  useEffect(() => {
    const getTeachers = async () => {
      try {
        const token = getToken();
        const url = `${BASE_URL}/teachers`;
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };
        const response = await sendRequest(url, "GET", null, headers);
        setTeachers(response);
      } catch (error) {
        console.log("en el catch de getAllTEacher")
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
          <Link className="btn btn-warning" to={`/orders//details`}>
            Detalle
          </Link>
        );
      },
    },
  ];
  return (
    <Main page={"teachers_page"}>
      <div className="row shadow-lg mt-5 py-4">
        <h2>Listado de profesores</h2>
        {isLoading ? (
          <Loader />
        ) : (
          <DataTable columns={columns} data={teachers} pagination />
        )}
      </div>
      <div className="row shadow-lg mt-5 py-4">
        <div className="col-12 text-center">
          <h2>Añadir</h2>
          <FormAddTeacher />
        </div>

      </div>
    </Main>
  );
};
