const mysql = require('mysql2');
const {promisify} = require('util');
/*   Si en la constante la llamo entre las llaves, lo que necesito hacer es nombrarlo 
como la variable que deseo importar y listo   */
const { database } =  require('./keys');

const pool = mysql.createPool(database);

pool.getConnection((err, connection) => {
    if (err) {
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            console.error('DATABASE CONNECTION HAS BEEN LOST');
        }
        if(err.code = "ER_CON_COUNT_ERROR"){
            console.error('DATABASE HAS BEEN OVERLOADED');
        }
        if(err.code === 'ECONNREFUSED'){
            console.error('DATABASE CONNECTION WAS REFUSED');
        }
    }
    if(connection) connection.release();
    console.log('DATABASE SUCCESFULLY CONNECTED');
    return;
});

//INVESTIGAR LO QUE SON PROMESAS Y CALLBACKS
pool.query = promisify(pool.query)

module.exports = pool;