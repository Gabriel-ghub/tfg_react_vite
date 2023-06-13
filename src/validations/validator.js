export const validationType = {
  sanitize: sanitize,
  validateName: validateName,
  email: validateEmail,
  atLeastOne: atLeastOne,
};

function sanitize(str) {
  // Elimina etiquetas HTML y PHP del string
  let output = str.replace(/<(?:.|\n)*?>/gm, "");

  // Elimina caracteres especiales que pueden ser utilizados en una inyección de código malicioso
  output = output.replace(/[&<>"'`=\/]/g, "");

  // Retorna el string sanitizado
  return output;
}

function validateName(cadena) {
  return sanitize(cadena.replace(/\s+/g, " ").trim());
}

function validateEmail(value) {
  const regex = /^$|^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(value);
}

function atLeastOne(value) {
  return value.length > 0;
}
