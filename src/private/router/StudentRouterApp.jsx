import { Navigate, Route, Routes } from "react-router-dom";
import { StudentsPage } from "../pages/StudentsPage";
import { HomeStudent } from "../studentPages/HomeStudent";

export const StudentRouterApp = () => {
  console.log("pasa por aca");
  return (
    <>
      <Routes>
        <Route path="/" element={<HomeStudent />} />
        <Route path="/home" element={<HomeStudent />} />
        <Route path="/*" element={<Navigate to={"/home"} />} />
      </Routes>
    </>
  );
};
