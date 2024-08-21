const mysql = require('mysql2');
const config = require('./../config');


const dbconf = {
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
}

//conexion

let connection;

// function connectDB(){
//     connection = mysql.createPool(dbconf);
//     console.log(`DB mysql Connected! no problem`);
// }

function handleCon(){
    connection = mysql.createConnection(dbconf);

    connection.connect((err)=>{
        if(err){
            console.error('[db err]',err);
            setTimeout(handleCon,2000);
        } else {
            console.log('DB Connected!');
            
        }
    });

    connection.on('error',(err) => {
        console.error('[db err]',err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            handleCon();
        } else {
            throw err;
        }
    });
}

handleCon();


function list(table){
    return new Promise((resolve,reject)=>{
        connection.query(`SELECT * FROM ${table}`, (err,data)=>{
            if(err) return reject(err);

            resolve(data);
        });
    });
}

function get(table,id){
    return new Promise((resolve,reject)=>{
        connection.query(`SELECT * FROM ${table} WHERE id=${id}`, (err,data)=>{
            if(err) return reject(err);

            resolve(data);
        });
    });
}

function insert(table, data){
    return new Promise((resolve,reject)=>{
        connection.query(`INSERT INTO ${table} SET ?`,data, (err,result)=>{
            if(err) return reject(err);

            resolve(result);
        });
    });
}

function get(table,id){
    return new Promise((resolve,reject)=>{
        connection.query(`SELECT * FROM ${table} WHERE id=${id}`, (err,data)=>{
            if(err) return reject(err);

            resolve(data);
        });
    });
}



module.exports = {
    list,
    get,
}