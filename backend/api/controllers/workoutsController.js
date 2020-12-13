'use strict';

var mongoose = require('mongoose'),
    Workout = mongoose.model('Workouts');


exports.listAll = function(req, res) {
    Workout.find({}, function(err, workout) {
        if (err)
            res.send(err);
        res.json(workout);
    });
};
      
exports.create = function(req, res) {
    var workout = new Workout(req.body);
    workout.save( function(err, workout) {
        if (err)
            res.send(err);
        res.json(workout);
    });
};

exports.getWorkout = function(req, res) {
    Workout.findById(req.params.workoutId, function(err, workout) {
        if (err)
            res.send(err);
        res.json(workout);
    });
};

exports.setWorkout = function(req, res) {
    Workout.findOneAndUpdate({_id: req.params.workoutId}, req.body, {new: true}, function(err, workout) {
        if (err)
            res.send(err);
        res.json(workout);
    });
};

exports.deleteWorkout = function(req, res) {
    Workout.deleteOne( {_id: req.params.workoutId}, function(err, workout) {
        if (err)
            res.send(err);
        res.json({ message: 'Workout successfully deleted' });
    });
};
