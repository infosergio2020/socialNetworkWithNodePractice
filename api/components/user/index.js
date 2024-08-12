const store = require('./../../../store/dummy');
const controller = require('./controller');

// injectamos el store al controlador para que store no quede aislado dentro del propio archivo
module.exports = controller(store);