'use strict';

console.log('Loading function');
const mysql = require('mysql');

const config = {
  host     : process.env.host,
  user     : process.env.user,
  password : process.env.password,
  database : process.env.database
};

class Database {
    constructor( config ) {
        this.connection = mysql.createConnection( config );
    }
    query( sql, args ) {
        return new Promise( ( resolve, reject ) => {
            this.connection.query( sql, args, ( err, rows ) => {
                if ( err )
                    return reject( err );
                resolve( rows );
            } );
        } );
    }
    close() {
        return new Promise( ( resolve, reject ) => {
            this.connection.end( err => {
                if ( err )
                    return reject( err );
                resolve();
            } );
        } );
    }
}

exports.handler = (event, context, callback) => {
    const database = new Database(config);
    return database.query('select PARSEADO from resultados where COD_ELEC=4 order by ACTUALIZADO DESC limit 1')
    .then( rows => {
      console.log('Result:', rows[0].PARSEADO);
      database.close();
      callback(null, rows[0].PARSEADO);
    });
};
