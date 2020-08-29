const mongoose = require('mongoose');

const dbConnection =  async () => {
    try {
        await mongoose.connect( process.env.URL_DB, {
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            useCreateIndex: true
        });

        console.log('Base de datos online');

    } catch ( err ) {
        console.log( err );
        throw new Error ('Conexion fallida a la base de datos');
    }
}

module.exports = {
    dbConnection
}