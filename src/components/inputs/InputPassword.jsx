import React from "react";
import { validationType } from "../../validations/validator";
import { getMessageValidation } from "../../config/validationMessages";
import { Error } from "../Error";

export const InputPassword = ({ data, register, errors }) => {
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
  } = data;

  const validationFunction = (value) => {
    console.log(value);
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
        {label}
      </label>
      <input
        className="form-control"
        type="password"
        {...register(nameBD, validationsFORM)}
      />
      {errors[nameBD]?.message && <Error error={errors[nameBD].message} />}
    </div>
  );
};
