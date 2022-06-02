'use strict';

module.exports = function(app) {

    var controller = require('../controllers/workoutsController');

    var api = '/api/v1';

    app.route(api+'/workouts')
        .get(controller.search)
        .post(controller.create);

    app.route(api+'/workouts/:workoutId')
        .get(controller.getById)
        .put(controller.edit)
        .delete(controller.delete);

    app.route(api+'/workouts/monthly/interval')
        .get(controller.listMonthlyInterval);
    
    app.route(api+'/workouts/monthly/:date')
        .get(controller.listMonthly);
    
    app.route(api+'/workouts/annual/total/:year')
        .get(controller.totalAnnual);
};