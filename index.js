const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { dbConnection } = require('./database/config');

console.log();
//Crear el servidor de express
const app = express();

//Base de datos
dbConnection();

app.use(express.static('public'));

//Cors
app.use( cors() );

//Lectura y parseo del body
app.use( express.json());

//Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

 

app.listen( process.env.PORT,  () => {
    console.log(`Servidor corriendo en el puerto ${ process.env.PORT}`);
});