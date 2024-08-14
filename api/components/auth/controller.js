const bcrypt = require('bcrypt');
const auth = require('./../../../auth');
const error = require('./../../../utils/error');
const TABLA = 'auth';

/**
 * Modulo para el controlador de usuarios.
 * Exporta funciones encapsuladas en otra función que inyecta la dependencia del store.
 * 
 * @param {Object} injectedStore - Dependencia inyectada que implementa las funciones de almacenamiento (list, get, upsert, remove).
 * @returns {Object} - Retorna un objeto con las funciones `list`, `get`, `upsert` y `remove`.
 */
module.exports = function (injectedStore) {
    
    let store = injectedStore;

    if(!store){
        store = require('../../../store/dummy');
    }

    /**
    * Obtiene las credenciales de un usuario por su username.
    * 
    * @param {string} username - El username del usuario a obtener.
    * @param {string} password - El password del usuario a obtener.
    * @returns {Promise<Object|null>} - Retorna una promesa que resuelve en el usuario encontrado o `null` si no se encuentra.
    */
    async function login(username,password){
        const data = await store.query(TABLA, {username:username});

        return bcrypt.compare(password,data.password).then((equals)=>{

            if(equals === true){
                //generar token
                return auth.sign(data);
            } else {
                throw error("Informacion invalida",400);
            }

        })
    }


    // funcion que almacena datos de autenticacion
    async function upsert(data){

        const authData = {
            id:data.id,
        }

        if(data.username){
            authData.username = data.username;
        }

        if(data.password){
            authData.password = await bcrypt.hash(data.password,5);
        }

        return store.upsert(TABLA,authData);
    }

    return {
        upsert,
        login,
    }

};