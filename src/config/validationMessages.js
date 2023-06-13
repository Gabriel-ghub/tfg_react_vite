export const getMessageValidation = ( kind, quantity = 0,) => {
  const validationMessages = {
    required: "Campo requerido",
    email: "Email inválido",
    minLength: `Mínimo ${quantity} caracteres`,
    maxLength: `Máximo ${quantity} caracteres`,
    min: `Mínimo ${quantity}`,
    max: `Máximo ${quantity}`,
    atLeastOne: "Debe crear al menos una",
  };

  return validationMessages[kind];
};
