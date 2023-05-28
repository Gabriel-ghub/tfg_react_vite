import React from "react";

export const TablePDF = ({ data }) => {
  const { students, car, works, materials, order, anomalies } = data;

  return (
    <table className="table table-bordered">
      <thead>
        <tr>
          <td rowSpan="4" className="w-50 h1">
            Automoción
          </td>
          <td rowSpan="4"></td>
          <td>Marca</td>
          <td>Matricula</td>
          <td>Entrada</td>
        </tr>
        <tr>
          <td>{car[0].brand}</td>
          <td>{car[0].plate}</td>
          <td>{order.date_in}</td>
        </tr>
        <tr>
          <td>Modelo</td>
          <td>Kilómetros</td>
          <td>Salida</td>
        </tr>
        <tr>
          <td>{car[0].model}</td>
          <td>{order.kilometres}</td>
          <td>{order.date_out}</td>
        </tr>
      </thead>
      <tr className="h5">Anomalias declaradas</tr>
      {anomalies &&
        anomalies.map((anomaly, index) => {
          return (
            <tr key={index}>
              <td colSpan="5">{anomaly}</td>
            </tr>
          );
        })}
      <tr className="h5">Trabajos realizados</tr>
      {works &&
        works.map((work, index) => {
          return (
            <tr key={index}>
              <td colSpan="5">{work}</td>
            </tr>
          );
        })}
      <tr className="h5">Alumnos</tr>
      {students &&
        students.map((student, index) => {
          return (
            <tr key={index}>
              <td colSpan="5">{student}</td>
            </tr>
          );
        })}
      <tr className="h5">Materiales colocados</tr>
      <tr>
        <td colSpan="3">Descripcion</td>
        <td >Cantidad</td>
        <td >Precio</td>
      </tr>
      {materials &&
        materials.map((material, index) => {
          return (
            <tr key={index}>
              <td colSpan="3">{material.description}</td>
              <td>{material.quantity}</td>
              <td>{material.price}€</td>
            </tr>
          );
        })}
    </table>
  );
};
