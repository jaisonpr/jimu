'use strict';

module.exports = function(app) {

    var controller = require('../controllers/workoutsController');

    app.route('/workouts')
        .get(controller.listAll)
        .post(controller.create);

    app.route('/workouts/:workoutId')
        .get(controller.getWorkout)
        .put(controller.setWorkout)
        .delete(controller.deleteWorkout);
};