const express = require('express');
const secure = require('./secure');
const response = require('./../../../network/response');
const Controller = require('./index');
const router = express.Router();

// Rutas
router.get('/', list);
router.get('/:id', get);
router.post('/', upsert);
router.put('/', secure('update'),upsert);
router.delete('/:id', remove);

//Internal functions

/**
 * Controlador para obtener la lista de usuarios.
 * 
 * @param {express.Request} req - Objeto de solicitud de Express.
 * @param {express.Response} res - Objeto de respuesta de Express.
 */
function list(req, res, next) {
    Controller.list()
        .then((lista) => {
            response.success(req, res, lista, 200);
        }).catch(next);
        // .catch((err) => {
        //     response.error(req, res, err, err.message, 500);
        // });
}

/**
 * Controlador para obtener un usuario por ID.
 * 
 * @param {express.Request} req - Objeto de solicitud de Express.
 * @param {express.Response} res - Objeto de respuesta de Express.
 */
function get(req, res, next) {
    Controller.get(req.params.id)
        .then((user) => {
            response.success(req, res, user, 200);
        }).catch(next);
        // .catch((err) => {
        //     response.error(req, res, err, err.message, 500);
        // });
}

/**
 * Controlador para crear o actualizar un usuario.
 * 
 * @param {express.Request} req - Objeto de solicitud de Express.
 * @param {express.Response} res - Objeto de respuesta de Express.
 */
function upsert(req, res, next) {
    Controller.upsert(req.body)
        .then((user) => {
            response.success(req, res, user, 200); // Aquí se usa `req.body` porque contiene los datos del usuario.
        }).catch(next);
        // .catch((err) => {
        //     response.error(req, res, err.message, 500);
        // });
}

/**
 * Controlador para eliminar un usuario por ID.
 * 
 * @param {express.Request} req - Objeto de solicitud de Express.
 * @param {express.Response} res - Objeto de respuesta de Express.
 */
function remove(req, res, next) {
    const userId = req.params.id;

    Controller.remove(userId)
        .then((removedUser) => {
            if (removedUser) {
                response.success(req, res, removedUser, 200);
            } else {
                response.error(req, res, "User not found", 404);
            }
        }).catch(next);
        // .catch((err) => {
        //     response.error(req, res, err.message, 500);
        // });
}

module.exports = router;