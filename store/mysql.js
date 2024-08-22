const mysql = require('mysql2');
const config = require('./../config');

// Configuración de la base de datos
const dbconf = {
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
};

// Conexión a la base de datos
let connection;

/**
 * Maneja la conexión con la base de datos MySQL.
 * Reintenta la conexión en caso de error o pérdida de conexión.
 */
function handleCon() {
    connection = mysql.createConnection(dbconf);

    connection.connect((err) => {
        if (err) {
            console.error('[db err]', err);
            setTimeout(handleCon, 2000); // Reintenta la conexión después de 2 segundos
        } else {
            console.log('DB Connected!');
        }
    });

    connection.on('error', (err) => {
        console.error('[db err]', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleCon(); // Reintenta la conexión si se pierde
        } else {
            throw err;
        }
    });
}

// Inicia la conexión
handleCon();

/**
 * Lista todas las filas de una tabla.
 * 
 * @param {string} table - El nombre de la tabla.
 * @returns {Promise<Object[]>} - Promesa que resuelve con las filas de la tabla.
 */
function list(table) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM ??`, [table], (err, data) => {
            if (err) return reject(err);
            resolve(data);
        });
    });
}

/**
 * Obtiene una fila de una tabla por su ID.
 * 
 * @param {string} table - El nombre de la tabla.
 * @param {string|number} id - El ID de la fila.
 * @returns {Promise<Object>} - Promesa que resuelve con la fila obtenida.
 */
function get(table, id) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM ?? WHERE id = ?`, [table, id], (err, data) => {
            if (err) return reject(err);
            resolve(data);
        });
    });
}

/**
 * Inserta datos en una tabla.
 * 
 * @param {string} table - El nombre de la tabla.
 * @param {Object} data - Los datos a insertar.
 * @returns {Promise<Object>} - Promesa que resuelve con el resultado de la inserción.
 */
function insert(table, data) {
    return new Promise((resolve, reject) => {
        connection.query(`INSERT INTO ?? SET ?`, [table, data], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
}

/**
 * Actualiza datos en una tabla.
 * 
 * @param {string} table - El nombre de la tabla.
 * @param {Object} data - Los datos a actualizar, debe incluir el ID.
 * @returns {Promise<Object>} - Promesa que resuelve con el resultado de la actualización.
 */
function update(table, data) {
    return new Promise((resolve, reject) => {
        connection.query(`UPDATE ?? SET ? WHERE id = ?`, [table, data, data.id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
}

/**
 * Inserta o actualiza datos en una tabla dependiendo si ya existen.
 * 
 * @param {string} table - El nombre de la tabla.
 * @param {Object} data - Los datos a insertar o actualizar.
 * @returns {Promise<Object>} - Promesa que resuelve con el resultado de la operación.
 */
async function upsert(table, data) {
    const row = await get(table, data.id);
    if (row.length === 0) {
        console.log("Realizando inserción de datos");
        return insert(table, data);
    } else {
        console.log("Realizando actualización de datos");
        return update(table, data);
    }
}

/**
 * Realiza una consulta personalizada en una tabla.
 * 
 * @param {string} table - El nombre de la tabla.
 * @param {Object} query - El objeto de consulta que define las condiciones.
 * @returns {Promise<Object|null>} - Promesa que resuelve con el primer resultado encontrado o null si no existe.
 */
function query(table, query) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM ?? WHERE ?`, [table, query], (err, res) => {
            if (err) return reject(err);
            resolve(res[0] || null);
        });
    });
}

// Exportación de funciones para su uso en otros módulos
module.exports = {
    list,
    get,
    insert,
    upsert,
    query,
};
