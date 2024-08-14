const db = {
    'user': [{ id: '1', name: "pedro" }],
};

/**
 * Obtiene la lista completa de elementos de una tabla específica.
 * 
 * @async
 * @function
 * @param {string} tabla - El nombre de la tabla a consultar.
 * @returns {Promise<Array>} - Retorna una promesa que resuelve en un array con todos los elementos de la tabla.
 */
async function list(tabla) {
    //console.log(db);
    
    return db[tabla] || [];
}

/**
 * Obtiene un elemento de la tabla por su ID.
 * 
 * @async
 * @function
 * @param {string} tabla - El nombre de la tabla a consultar.
 * @param {string} id - El ID del elemento a obtener.
 * @returns {Promise<Object|null>} - Retorna una promesa que resuelve en el elemento encontrado o `null` si no se encuentra.
 */
async function get(tabla, id) {
    let col = await list(tabla);
    return col.filter(item => item.id === id)[0] || null;
}

/**
 * Inserta o actualiza un elemento en la tabla.
 * 
 * @async
 * @function
 * @param {string} tabla - El nombre de la tabla donde se va a insertar o actualizar el elemento.
 * @param {Object} data - Los datos del elemento a insertar o actualizar.
 * @returns {Promise<void>} - Retorna una promesa que se resuelve cuando la operación se completa.
 */
async function upsert(tabla, data) {
    
    if(!db[tabla]){
        db[tabla] = [];
    }    

    let col = await list(tabla);
    const index = col.findIndex(item => item.id === data.id);

    if (index !== -1) {
        // Si el elemento existe, lo actualizamos
        col[index] = data;
    } else {
        // Si no existe, lo añadimos
        col.push(data);
    }
}

/**
 * Elimina un elemento de la tabla por su ID.
 * 
 * @async
 * @function
 * @param {string} tabla - El nombre de la tabla donde se va a eliminar el elemento.
 * @param {string} id - El ID del elemento a eliminar.
 * @returns {Promise<Object|null>} - Retorna una promesa que resuelve en el elemento eliminado o `null` si no se encuentra.
 */
async function remove(tabla, id) {
    let col = await list(tabla);
    const index = col.findIndex(item => item.id === id);

    if (index !== -1) {
        const removedItem = col.splice(index, 1)[0];
        return removedItem;
    }
    return null;
}

/**
 * Funcion que realiza consultas a la base de datos, mediante filtracion utilizando los parametros de query enviados
 * 
 * @async
 * @function
 * @param {string} tabla - El nombre de la tabla donde se va a eliminar el elemento.
 * @param {Object} q - Los datos del elemento a buscar.
 * @returns {Promise<Object|null>} - Retorna una promesa que resuelve en el elemento encontrado o `null` si no se encuentra.
 */
async function query(tabla,q){
    let col = await list(tabla);
    let keys = Object.keys(q);
    let key = keys[0];
    return col.filter(item => item[key] === q[key])[0] || null;
}

module.exports = {
    list,
    get,
    upsert,
    remove,
    query,
};
