export const validationType = {
    text: validateText,
    number: validateNumber,
    sanitize:sanitize,
    length: validateLength,
    isSafe : isSafe,
    textandnumber:textandnumber,
    characterSafe:characterSafe
}

function validateNumber(str) {
    const regexPhone = /^[0-9]{0,15}$/;
    if (!regexPhone.test(str)) {
        return false;
    }
    return true;
}

function validateText(str) {
    const regexText = /^[a-zA-Z\s]{0,40}$/
    if (!regexText.test(str)) {
        return false;
    }
    return true
}

function sanitize(str) {
    // Elimina etiquetas HTML y PHP del string
    let output = str.replace(/<(?:.|\n)*?>/gm, '');

    // Elimina caracteres especiales que pueden ser utilizados en una inyección de código malicioso
    output = output.replace(/[&<>"'`=\/]/g, '');

    // Retorna el string sanitizado
    return output;
}

function validateLength(str,length){
    return str.length < length
}

function isSafe(str){
    const safeRegex = /^\s*[a-zA-Z0-9]*$/;
    return safeRegex.test(str);
}

function textandnumber(str){
    const regex = /^\s*[a-zA-Z0-9]*$/;
    return regex.test(str)
}

function characterSafe(str){
    const regex = /^(?!.*[<>]).*$/;
    return regex.test(str)

}