'use strict';

var mongoose = require('mongoose'),
    Workout = mongoose.model('Workouts');


exports.listAll = function (req, res) {
    Workout.find({}, function (err, workout) {
        if (err)
            res.send(err);
        res.json(workout);
    });
};

exports.create = function (req, res) {
    var workout = new Workout(req.body);

    console.log(workout);

    workout.save(function (err, workout) {
        if (err)
            res.send(err);
        res.json(workout);
    });
};

exports.getById = function (req, res) {
    Workout.findById(req.params.workoutId, function (err, workout) {
        if (err)
            res.send(err);
        res.json(workout);
    });
};

exports.edit = function (req, res) {
    Workout.findOneAndUpdate({ _id: req.params.workoutId }, req.body, { new: true }, function (err, workout) {
        if (err)
            res.send(err);
        res.json(workout);
    });
};

exports.delete = function (req, res) {
    Workout.deleteOne({ _id: req.params.workoutId }, function (err, workout) {
        if (err)
            res.send(err);
        res.json({ message: 'Workout successfully deleted' });
    });
};


exports.listMonthly = function (req, res) {

    let [year, month, day] = req.params.date.split("=")[1].split("-");
    let lastDay = new Date(year, month, 0).getDate();
    let startDate = `${year}-${month}-01`;
    let endDate = `${year}-${month}-${lastDay}`;

    Workout.find({
        dateTime: {
            $gte: (new Date(startDate)),
            $lte: (new Date(endDate))
        }
    }, function (err, workout) {
        if (err)
            res.send(err);
        res.json(workout);
    });
};



exports.listByDate = function (req, res) {

    let { startDate, endDate } = req.query;

    if (startDate === '' || endDate === '') {
        return res.status(400).json({
            status: 'failure',
            message: 'Please ensure you pick two dates'
        })
    }
};
