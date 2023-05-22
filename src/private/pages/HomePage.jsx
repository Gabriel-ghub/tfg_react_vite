import React from "react";
import { Outlet } from "react-router-dom";
import { Main } from "../components/global/Main";

export const HomePage = () => {
  return (
    <>
      <Main page="home_page">
        <Outlet></Outlet>
      </Main>
    </>
  );
};
