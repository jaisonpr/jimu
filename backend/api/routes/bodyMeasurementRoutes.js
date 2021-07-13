'use strict';

module.exports = function(app) {

    var controller = require('../controllers/bodyMeasurementController');

    var api = '/api/v1';

    app.route(api+'/bodyMeasurements')
        .get(controller.listAll)
        .post(controller.create);

    app.route(api+'/bodyMeasurements/:bodyMeasurementId')
        .get(controller.getById)
        .put(controller.edit)
        .delete(controller.delete);
};