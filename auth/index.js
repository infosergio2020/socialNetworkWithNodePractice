const jwt = require('jsonwebtoken');
const config = require('./../config');
//se establece el secret para las funciones de jwt
const secret = config.jwt.secret;

function sing(data){
    let token = jwt.sign( data, secret);
    return token;
}

function verify(){
    return jwt.verify(token, secret);
}

const check = {
    own: function(req,owner){
        const decoded = decodeHeader(req);
        console.log(decoded);
    }
}

/**
 * Funcion encargada de procesar el token
 * @param {string} auth token a procesar
 * @returns 
 */
function getToken(auth){
    if(!auth){
        throw new Error("No viene token");
    }
    if(auth.indexOf('Bearer ') === -1){
        throw new Error("Formato invalido.");
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
    sing,
}