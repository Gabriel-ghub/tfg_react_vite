import { FormSearchCar } from "../components/FormSearchCar";
import { Main } from "../components/global/Main";
import React, { useContext } from "react";
import { Loader } from "../../components/Loader";
import { useForm } from "../../hooks/useForm";
import { CarContext } from "../context/CarContext/CarContext";
import { CarCard } from "../components/CarCard";
import { FormCreateCar } from "../components/FormCreateCar";

export const SearchCarPage = () => {
  const { notFound, found, isLoading } = useContext(CarContext);

  return (
    <Main page={"search_page"}>
      <div className="row shadow-lg mt-5 py-5">
        <div className="col-12 col-md-6 d-flex align-items-center gap-2 flex-column">
          <FormSearchCar />
        </div>
        <div className="col-12 col-md-6 d-flex justify-content-center align-items-center">
          {isLoading ? (
            <Loader></Loader>
          ) : found ? (
            <CarCard></CarCard>
          ) : notFound ? (
            <FormCreateCar></FormCreateCar>
          ) : null}
        </div>
      </div>
    </Main>
  );
};
