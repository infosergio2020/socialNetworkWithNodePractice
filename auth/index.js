const jwt = require('jsonwebtoken');
const config = require('./../config');
const error = require('../utils/error');
//se establece el secret para las funciones de jwt
const secret = config.jwt.secret;

/**
 * Firma los datos con un token JWT.
 * @param {Object} data - Los datos a firmar dentro del token.
 * @returns {string} El token JWT generado.
 */
function sign(data) {
    let token = jwt.sign(data, secret);
    return token;
}

/**
 * Verifica un token JWT.
 * @param {string} token - El token JWT a verificar.
 * @returns {Object} Los datos decodificados si el token es válido.
 * @throws {Error} Si el token no es válido o ha expirado.
 */
function verify(token) {
    console.log(`Token a verificar: ${token}`);
    return jwt.verify(token, secret);
}

/**
 * Objeto para realizar comprobaciones de propiedad.
 * @type {Object}
 */
const check = {
    /**
     * Verifica si el usuario autenticado es el propietario de los datos.
     * @param {Object} req - El objeto de solicitud HTTP.
     * @param {string|number} owner - El ID del propietario a comparar.
     * @throws {Error} Si el usuario autenticado no es el propietario.
     */
    own: function(req, owner) {
        const decoded = decodeHeader(req);
        console.log(decoded);

        // Comprobar si es o no propio
        if (decoded.id !== owner) {
            throw error("No puedes hacer esto.", 401);
        }
    }
};

/**
 * Funcion encargada de procesar el token
 * @param {string} auth token a procesar
 * @returns 
 */
function getToken(auth){
    if(!auth){
        throw error("No viene token",401);
    }
    if(auth.indexOf('Bearer ') === -1){
        throw error("Formato invalido.",400);
    }
    let token = auth.replace('Bearer ', '');
    return token;
}

/**
 * funcion para verificar el token en authorization en el header
 * @param {express.Request} req - Objeto de solicitud de Express.
 */
function decodeHeader (req){
    const authorization = req.headers.authorization || '';
    const token = getToken(authorization); //obtener token
    const decoded = verify(token); //validar token

    //por si es necesario se almacena en la request
    req.user = decoded;

    return decoded;
}

module.exports = {
    sign,
    check,
}