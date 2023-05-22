import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
// import { Footer } from "./Footer";
import { NavBar } from "./NavBar";

export const Layout = () => {
  return (
    <>
      <NavBar></NavBar>
      <Outlet />
      {/* <Footer></Footer> */}
    </>
  );
};
