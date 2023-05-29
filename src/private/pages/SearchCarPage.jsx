import { FormSearchCar } from "../components/FormSearchCar";
import { Main } from "../components/global/Main";
import { useState } from "react";
import { CarCard } from "../components/CarCard";
import { FormCreateCar } from "../components/FormCreateCar";

export const SearchCarPage = () => {
  const [carFound, setCarFound] = useState(false);



  return (
    <Main page={"search_page"}>
      <div className="row flex-md-row shadow-lg mt-5 gap-3 gap-md-0 py-5">
        <div className="col-12 col-md-6 d-flex align-items-center gap-2 flex-column">
          <FormSearchCar setCarFound={setCarFound} />
        </div>
        <div className="col-12 col-md-6 d-flex justify-content-center align-items-center">
          {carFound && <CarCard car={carFound} />}
          {carFound === null && <FormCreateCar setCarFound={setCarFound} />}
        </div>
      </div>
    </Main>
  );
};
