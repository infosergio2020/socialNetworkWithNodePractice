const express = require('express');
const response = require('./../../../network/response');
const Controller = require('./index');
const router = express.Router();

// Rutas
router.post('/login', login);

//Internal functions

/**
 * Controlador para realizar el login de un usuario por username y password.
 * 
 * @param {express.Request} req - Objeto de solicitud de Express.
 * @param {express.Response} res - Objeto de respuesta de Express.
 */
function login(req, res) {
    Controller.login(req.body.username,req.body.password).then((token) => {
        response.success(req,res,token,200)
    }).catch((err) => {
        response.error(req,res,"Informacion invalida.", 400);
    });
}


module.exports = router;