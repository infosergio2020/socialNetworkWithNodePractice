// Función para importar `nanoid` de manera dinámica
async function getNanoid() {
    const { nanoid } = await import('nanoid');
    return nanoid;
}

const auth = require('./../auth');

const TABLA = 'user';

/**
 * Modulo para el controlador de usuarios.
 * Exporta funciones encapsuladas en otra función que inyecta la dependencia del store.
 * 
 * @param {Object} injectedStore - Dependencia inyectada que implementa las funciones de almacenamiento (list, get, upsert, remove).
 * @returns {Object} - Retorna un objeto con las funciones `list`, `get`, `upsert` y `remove`.
 */
module.exports = function (injectedStore) {

    let store = injectedStore;
    // validación de dependencia
    if (!store) {
        // db de contingencia
        store = require('./../../../store/dummy');
    }

    /**
     * Lista todos los usuarios en la tabla.
     * 
     * @returns {Promise<Array>} - Retorna una promesa que resuelve en un array de usuarios.
     */
    function list() {
        return store.list(TABLA);
    }

    /**
     * Obtiene un usuario por su ID.
     * 
     * @param {string} id - El ID del usuario a obtener.
     * @returns {Promise<Object|null>} - Retorna una promesa que resuelve en el usuario encontrado o `null` si no se encuentra.
     */
    function get(id) {
        return store.get(TABLA, id);
    }

    /**
     * Inserta o actualiza un usuario en la tabla.
     * 
     * @param {Object} body - Los datos del usuario a insertar o actualizar.
     * @returns {Promise<void>} - Retorna una promesa que se resuelve cuando la operación se completa.
     */
    async function upsert(body) {

        const nanoid = await getNanoid();
        const user = {
            name: body.name,
            username: body.username,
        }

        if(body.id){
            user.id = body.id;
        } else {
            user.id = nanoid();
        }

        // antes de editar o crear el usuario hay que validar
        if(body.password || body.username){
            await auth.upsert({
                id:user.id,
                username:user.username,
                password:body.password,
            });
        }

        return store.upsert(TABLA, user);
    }

    /**
     * Elimina un usuario por su ID.
     * 
     * @param {string} id - El ID del usuario a eliminar.
     * @returns {Promise<Object|null>} - Retorna una promesa que resuelve en el usuario eliminado o `null` si no se encuentra.
     */
    function remove(id) {
        return store.remove(TABLA, id);
    }

    return { list, get, upsert, remove };
}
