const auth = require('./../../../auth')

/**
 * Middleware para verificar la autenticidad de la acción según el tipo de acción.
 * @param {string} action - La acción que se desea validar (por ejemplo, 'update').
 * @returns {Function} Middleware de Express que verifica la autenticidad.
 */
module.exports = function checkAuth(action) {

    /**
     * Middleware que valida si el usuario tiene autorización para realizar la acción.
     * @param {Object} req - El objeto de solicitud HTTP.
     * @param {Object} res - El objeto de respuesta HTTP.
     * @param {Function} next - Función para pasar al siguiente middleware.
     * @throws {Error} Si la autenticación falla o el usuario no tiene permisos.
     */
    function middleWare(req, res, next) {
        if (action === 'update') {
            // Usuario que se quiere modificar
            const owner = req.body.id;
            auth.check.own(req, owner);
            next();
        } else {
            next();
        }
    }

    return middleWare;
};