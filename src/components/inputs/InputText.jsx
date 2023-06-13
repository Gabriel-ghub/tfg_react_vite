import React, { useState } from "react";
import { getMessageValidation } from "../../config/validationMessages";
import { Error } from "../Error";
import { validationType } from "../../validations/validator";

export const InputText = ({
  data,
  register,
  errors,
  isEditing,
  dataForm,
  formEditable,
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

  const validationFunction = (value) => {
    return (
      validationType[validation](value) || getMessageValidation(validation)
    );
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
        {label || ""}
      </label>
      {(isEditing && isEditable) || formEditable === 0 ? (
        <input
          className="form-control"
          type="text"
          {...register(nameBD, validationsFORM)}
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
