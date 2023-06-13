import React, { useEffect, useState } from "react";
import { getMessageValidation } from "../../config/validationMessages";
import { Error } from "../Error";
import { validationType } from "../../validations/validator";
import { v4 as uuidv4 } from "uuid";

export const InputAdd = ({
  data,
  register,
  errors,
  isEditing,
  dataForm,
  formEditable,
  setValue,
  getValues,
  setError,
  clearErrors,
}) => {
  const {
    label,
    nameBD,
    type,
    placeholder,
    required,
    min,
    max,
    minLength,
    maxLength,
    validation,
    isEditable,
  } = data;
  const [accumulated, setAccumulated] = useState([]);
  const [arrData, setArrData] = useState([]);
  const [datos, setDatos] = useState("");

  const validationFunction = (value) => {
    return (
      validationType[validation](arrData) || getMessageValidation(validation)
    );
  };

  useEffect(() => {
    setValue(nameBD, []);
    setError(nameBD, { type: "custom", message: "Debe agregar al menos una." });
  }, []);

  const validationsFORM = {
    ...(required
      ? {
          required: {
            value: true,
            message: getMessageValidation("required"),
          },
        }
      : {}),
    ...(min
      ? { min: { value: min, message: getMessageValidation("min", min) } }
      : {}),
    ...(max
      ? { max: { value: max, message: getMessageValidation("max", max) } }
      : {}),
    ...(minLength
      ? {
          minLength: {
            value: minLength,
            message: getMessageValidation("minLength", minLength),
          },
        }
      : {}),
    ...(maxLength
      ? {
          maxLength: {
            value: maxLength,
            message: getMessageValidation("maxLength", maxLength),
          },
        }
      : {}),
    ...(validation && validationType[validation]
      ? {
          validate: validationType[validation] && validationFunction,
        }
      : {}),
  };

  const addAculumated = (e) => {
    e.preventDefault();
    if (datos != "") {
      const id = uuidv4();
      setAccumulated([...accumulated, { label: datos, id: id }]);
      setArrData([...arrData, { label: datos, id: id }]);
      clearErrors(nameBD);
      setValue(nameBD, [[...arrData, { label: datos, id: id }]]);
      setDatos("");
    }
  };

  const deleteAccumulated = (id) => {
    if (accumulated.length == 1) {
      setError(nameBD, {
        type: "custom",
        message: "Debe agregar al menos una.",
      });
    }
    setAccumulated(accumulated.filter((item) => item.id != id));
    setArrData(arrData.filter((item) => item.id != id));
  };
  return (
    <div className="form-group">
      <label className="form-label" htmlFor="">
        {label}
      </label>
      {accumulated.length > 0 && (
        <ul className="p-0 d-flex flex-column gap-2">
          {accumulated.map((item) => {
            return (
              <li
                key={item.id}
                className="d-flex justify-content-between border-bottom align-items-center"
              >
                <p className="m-0">{item.label}</p>
                <button
                  className="btn btn-danger text-white"
                  onClick={(e) => {
                    e.preventDefault();
                    deleteAccumulated(item.id);
                  }}
                >
                  Borrar
                </button>
              </li>
            );
          })}
        </ul>
      )}
      <input
        value={datos}
        name="datos"
        onChange={(e) => setDatos(e.target.value)}
        className="form-control"
        type="text"
        placeholder={placeholder}
      />
      {errors[nameBD]?.message && <Error error={errors[nameBD].message} />}
      <div className="col-12 d-flex justify-content-center">
        <button onClick={addAculumated} className="btn">
          <svg
            className="cursor-pointer"
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            fill="#027373"
            viewBox="0 0 16 16"
          >
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
          </svg>
        </button>
      </div>
    </div>
  );
};
