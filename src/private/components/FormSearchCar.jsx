import React, { useContext, useState } from "react";
import { useForm } from "../../hooks/useForm";
import { CarContext } from "../context/CarContext/CarContext";
import { validationType } from "../../validations/validator";


const initalForm = {
  matricula: "",
};

export const FormSearchCar = () => {
  const { matricula, onInputChange } = useForm(initalForm);
  const {
    getCarInfo,
    isLoading,
  } = useContext(CarContext);
  const [validationError, setValidationError] = useState(false)

  const handleChangePlate = (e) =>{
    if(!(validationType["length"](e.target.value,11) &&validationType["textandnumber"](e.target.value,11))){
      return false
    }
    onInputChange(e)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const regex = /^[a-zA-Z0-9]+$/g;
    if (regex.test(matricula)) {
      getCarInfo(matricula);
    } else {
      setValidationError("Error en matrícula, solo puede ingresar numeros y letras")
    }
  };

  return (
    <>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="align-items-center justify-content-center col-8 mx-auto"
      >
        <div className="form-group d-flex flex-column col-12 text-center">
          <label htmlFor="lastName">
            <h3>Introduce la matrícula</h3>
          </label>
          <input
            className="form-control mt-3 text-center"
            type="text"
            value={matricula}
            name="matricula"
            onChange={handleChangePlate}
          />
          {!isLoading && (
            <button
              onClick={handleSubmit}
              type="submit"
              className="btn btn-primary mx-auto mt-3"
              disabled={(matricula == "")}
            >
              Buscar
            </button>
          )}
        </div>
      </form>
      {validationError && (<div class="alert alert-danger" role="alert">{validationError}</div>
      )}
    </>
  );
};
