import React, { useState } from "react";
import { getMessageValidation } from "../../config/validationMessages";
import { validationType } from "../../validations/validator";
import { Error } from "../Error";

export const InputKilometres = ({
  data,
  register,
  errors,
  isEditing,
  dataForm,
  formEditable,
  setValue,
  clearErrors,
  setErrors
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

  const formatNumber = (value) => {
    // Eliminar todos los caracteres que no sean dígitos
    const digitsOnly = value.replace(/\D/g, "");
    // Agregar separador de miles cada 3 dígitos
    const formattedValue = digitsOnly.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    return formattedValue;
  };

  const handleKilometresChange = (event) => {
    const { name, value } = event.target;
    const formattedValue = formatNumber(value);
    if (value != "") {
      clearErrors(nameBD);
    } else {
      setErrors(nameBD, { type: "required", message: "Campo requerido" });
    }
    setValue(nameBD, formattedValue);
  };

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
  return (
    <div className="form-group">
      <label className="form-label" htmlFor="">
        {label}
      </label>
      {(isEditing && isEditable) || formEditable === 0 ? (
        <input
          className="form-control"
          type="text"
          {...register(nameBD, validationsFORM)}
          onChange={handleKilometresChange}
          placeholder={placeholder}
        />
      ) : (
        <div className="form-control" style={{ backgroundColor: "#e9ecef" }}>
          {dataForm[nameBD] || "No hay datos"}
        </div>
      )}

      {errors[nameBD]?.message && <Error error={errors[nameBD].message} />}
    </div>
  );
};
