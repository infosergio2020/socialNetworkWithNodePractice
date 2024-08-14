const express = require('express');
const bodyParser = require('body-parser');

const swaggerUI = require('swagger-ui-express');

const config = require('./../config');
const user = require('./components/user/network');
const auth = require('./components/auth/network');
const errors = require('./../network/errors');
const app = express();

// complements
app.use(bodyParser.json());

const swaggerDoc = require('./swagger.json');

// ROUTER
app.use("/api/user",user);
app.use("/api/auth",auth);
app.use("/api-docs",swaggerUI.serve,swaggerUI.setup(swaggerDoc));

// es importante que este middleware este siempre al final
app.use(errors);

app.listen(config.api.port,()=>{
    console.log(`Escuchando desde el puerto: ${config.api.port}`);
});