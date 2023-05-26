import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { Layout } from "../components/global/Layout";
import { CourseDetails } from "../pages/CourseDetails";
import { CoursesPage } from "../pages/CoursesPage";
import { CreateOrder } from "../pages/CreateOrder";
import { FacturationPage } from "../pages/FacturationPage";
import { HomePage } from "../pages/HomePage";
import { OrderDetails } from "../pages/OrderDetails";
import { OrdersPage } from "../pages/OrdersPage";
import { SearchCarPage } from "../pages/SearchCarPage";
import { StudentsPage } from "../pages/StudentsPage";
import { TeachersPage } from "../pages/TeachersPage";
import { Works } from "../pages/Works";
import { StudentAssigned } from "../pages/StudentAssigned";
import { StudentDetails } from "../pages/StudentDetails";
import { TeacherDetails } from "../pages/TeachersDetails";
import { NavBar } from "../components/global/NavBar";

export const RouterApp = () => {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="home" element={<OrdersPage />}></Route>
        <Route path="car" element={<SearchCarPage />}></Route>
        <Route
          path="car/:plate_car/createorder"
          element={<CreateOrder />}
        ></Route>
        <Route path="orders" element={<OrdersPage />}></Route>
        <Route
          path="orders/:order_id/details"
          element={<OrderDetails />}
        ></Route>
        {/* <Route
            path="works/:work_id/details" element={<WorksDetails/>}
          ></Route> */}
        {/* <Route path="orders/:order_id/works" element={<WorksPage />}></Route> */}
        <Route path="students" element={<StudentsPage />}></Route>
        <Route
          path="student/:student_id/detail"
          element={<StudentDetails />}
        ></Route>
        {/* <Route
            path="teacher/:teacher_id/detail"
            element={<TeacherDetails />}
          ></Route> */}
        <Route path="teachers" element={<TeachersPage />}></Route>
        <Route path="facturation" element={<FacturationPage />}></Route>
        <Route path="courses" element={<CoursesPage />}></Route>
        <Route
          path="course/:course_id/detail"
          element={<CourseDetails />}
        ></Route>
        <Route path="/*" element={<Navigate to={"/home"} />}></Route>
      </Routes>
    </>
  );
};
