'use strict';

module.exports = function(app) {

    let controller = require('../controllers/bodyMeasurementController');

    let api = '/api/v1';

    app.route(api+'/bodyMeasurements')
        .get(controller.search) 
        .post(controller.create);

    app.route(api+'/bodyMeasurements/:bodyMeasurementId')
        .get(controller.getById)
        .put(controller.edit)
        .delete(controller.delete);
};