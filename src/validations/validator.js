export const validationType = {
  sanitize: sanitize,
  validateName: validateName,
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
