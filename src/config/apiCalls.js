import { BASE_URL } from "../api/api";

const AUTH_URLS = (user_id = "") => {
  const apiCalls = {
    // AUTH
    login: `${BASE_URL}/login`,
    logout: `${BASE_URL}/logout`,
    index: `${BASE_URL}/users`,
    me: `${BASE_URL}/me`,
    refresh: `${BASE_URL}/refresh`,
    getUserById: `${BASE_URL}/user/${user_id}`,
    update: `${BASE_URL}/user`,
    delete: `${BASE_URL}/user/${user_id}`,
    changePassword: `${BASE_URL}/user/changePassword`,
  };
};

const CARS_URLS = (car_id = "") => {
  const apiCalls = {
    index: `${BASE_URL}/cars`,
    create: `${BASE_URL}/car/create`,
    updateAndPlate: `${BASE_URL}/car/${car_id}`,
    update: `${BASE_URL}/car/${car_id}/update`,
    delete: `${BASE_URL}/car/${car_id}`,
    getCar: `${BASE_URL}/car/${car_id}`,
  };
};

const COURSE_URLS = (course_id = "") => {
  const apiCalls = {
    index: `${BASE_URL}/courses`,
    create: `${BASE_URL}/courses`,
    delete: `${BASE_URL}/courses/`,
    getCourse: `${BASE_URL}/course/${course_id}`,
    getCourse: `${BASE_URL}/course/${course_id}/update`,
    getStudents: `${BASE_URL}/course/${course_id}/students`,
  };
};

const ORDERS_URLS = (url,order_id = "", course_id = "") => {
  const apiCalls = {
    index: `${BASE_URL}/orders`,
    create: `${BASE_URL}/orders`,
    delete: `${BASE_URL}/orders/`,
    update: `${BASE_URL}/order/${order_id}/update`,
    getOrder: `${BASE_URL}/order/${order_id}/details`,
    attach: `${BASE_URL}/order/attach`,
    detach: `${BASE_URL}/order/detach`,
    studentsAvailables: `${BASE_URL}/order/${order_id}/course/${course_id}`,
    ordersFromStudents: `${BASE_URL}/orders/student`,
    prueba: `${BASE_URL}/order/prueba`,
  };
  return apiCalls[url];
};

export const API_URLS = {
  auth: AUTH_URLS,
  cars: CARS_URLS,
  courses: COURSE_URLS,
  orders: ORDERS_URLS,
};
