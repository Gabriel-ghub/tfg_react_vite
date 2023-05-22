import React from "react";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";

export const OrderTable = ({ orders }) => {
  const columns = [
    {
      name: "Orden",
      selector: (row) => row.id,
    },
    {
      name: "Matrícula",
      selector: (row) => row.name,
    },
    {
      name: "Orden",
      selector: (row) => row.surname,
    },
    {
      name: "Orden",
      selector: (row) => row.state,
    },
    {
      name: "Orden",
      selector: (row) => row.date_in,
    },
    {
      name: "Orden",
      selector: (row) => {return <Link className="btn btn-warning" to={`/orders/${row.id}/details`}>Detalle</Link>},
    },
  ];
  return (
    <>
      <DataTable columns={columns} data={orders} pagination/>
    </>
  );
};
