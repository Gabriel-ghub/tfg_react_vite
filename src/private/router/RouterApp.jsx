import { Navigate, Route, Routes } from "react-router-dom";
import { CourseDetails } from "../pages/CourseDetails";
import { CoursesPage } from "../pages/CoursesPage";
import { CreateOrder } from "../pages/CreateOrder";
import { FacturationPage } from "../pages/FacturationPage";
import { OrderDetails } from "../pages/OrderDetails";
import { OrdersPage } from "../pages/OrdersPage";
import { SearchCarPage } from "../pages/SearchCarPage";
import { StudentsPage } from "../pages/StudentsPage";
import { AccessPage } from "../pages/AccessPage";
import { StudentDetails } from "../pages/StudentDetails";
import { NavBar } from "../components/global/NavBar";
import { CarsPage } from "../pages/CarsPage";
import { CarDetails } from "../pages/CarDetails";
import { FormularioReactivo } from "../../components/FormularioReactivo";
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
        <Route path="car/:car_id/details" element={<CarDetails />}></Route>
        <Route path="students" element={<StudentsPage />}></Route>
        <Route
          path="student/:student_id/detail"
          element={<StudentDetails />}
        ></Route>
        <Route path="cars" element={<CarsPage />}></Route>
        <Route path="access" element={<AccessPage />}></Route>
        <Route path="facturation" element={<FacturationPage />}></Route>
        <Route path="courses" element={<CoursesPage />}></Route>
        <Route
          path="course/:course_id/detail"
          element={<CourseDetails />}
        ></Route>
        <Route
          path="createOrderForm"
          element={<FormularioReactivo formName={"createOrder"} />}
        ></Route>
        <Route
          path="createCourseForm"
          element={<FormularioReactivo formName={"orderDetails"} />}
        ></Route>
        <Route path="/*" element={<Navigate to={"/home"} />}></Route>
      </Routes>
    </>
  );
};
