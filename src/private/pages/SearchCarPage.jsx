import { FormSearchCar } from "../components/FormSearchCar";
import { Main } from "../components/global/Main";
import { useState } from "react";
import { CarCard } from "../components/CarCard";
import { FormCreateCar } from "../components/FormCreateCar";
import { FormularioReactivo } from "../../components/FormularioReactivo";
import { useToken } from "../../hooks/useToken";
import { BASE_URL } from "../../api/api";
import { Loader } from "../../components/Loader";
import useHttp from "../../hooks/useHttp";

export const SearchCarPage = () => {
  const [carFound, setCarFound] = useState(false);

  const { getToken } = useToken();
  const { sendRequest, isLoading, error } = useHttp();
  const getCarInfo = async (data) => {
    const matricula = data.plate;
    const token = getToken();
    const url = `${BASE_URL}/car/search?plate=${matricula}`;
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    const response = await sendRequest(url, "GET", null, headers);
    if (response) {
      const car = {
        id: response.id,
        plate: response.plate,
        brand: response.brand,
        model: response.model,
      };
      setCarFound(car);
    } else {
      setCarFound(null);
    }
  };

  const createCar = async (data) => {
    const token = JSON.parse(localStorage.getItem("token"));

    const car = {
      plate: data.plate.trim(),
      brand: data.brand.trim(),
      model: data.model.trim(),
    };
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    const body = JSON.stringify(car);
    const response = await sendRequest(url_create_car, "POST", body, headers);

    if (response) {
      const newCar = {
        plate: response.car.plate,
        model: response.car.model,
        brand: response.car.brand,
        id: response.car.id,
      };
      setCarFound(newCar);
    } else {
    }
  };

  return (
    <Main page={"search_page"}>
      <div className="row flex-md-row shadow-lg mt-5 gap-3 gap-md-0 py-5">
        <div className="col-12 col-md-6 d-flex align-items-center gap-2 flex-column">
          {/* <FormSearchCar setCarFound={setCarFound} /> */}
          <h2 className="text-center">Introduce la matrícula</h2>
          <FormularioReactivo
            formName={"searchCarForm"}
            className={"col-12 col-sm-10 col-md-6 gap-3"}
            action={getCarInfo}
          />
        </div>
        <div className="col-12 col-md-6 d-flex align-items-center gap-2 flex-column">
          {carFound && <CarCard car={carFound} />}
          {/* {carFound === null && <FormCreateCar setCarFound={setCarFound} />} */}
          {carFound === null && (
            <>
              <h2>Sin coincidencias.</h2>
              <h3>¿Quiere crear un coche nuevo?</h3>
              <FormularioReactivo
                formName={"createCarForm"}
                className={"col-12 col-sm-10 col-md-8 gap-3"}
                action={createCar}
              />
            </>
          )}
        </div>
      </div>
    </Main>
  );
};
