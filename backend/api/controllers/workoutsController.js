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

    let startDate = `${year}-${month}-01 00:00:00`;
    let endDate = `${year}-${month}-${lastDay} 23:59:59`;

    Workout.find({
        dateTime: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
        }
    }, function (err, workout) {
        if (err)
            res.send(err);
        res.json(workout);
    });
};


exports.search = function (req, res) {

    let { title, dateInitial, dateFinal, local, sport } = req.query;
    let query = {};

    if (title != '') {
        query.title = { $regex: '.*' + title + '.*' };
    }
    if (dateInitial != '')  {
        query.dateTime = {
            $gte: new Date(`${dateInitial} 00:00:00`),
            $lte: new Date(`${dateFinal} 23:59:59`)
        }
    }
    if (local != '') query.local = { $regex: '.*' + local + '.*' };
    if (sport != '') query.sport = { $eq: sport };

    Workout
        .find( query ) 
        .sort( { 'dateTime': 'asc' } )
        .exec( 
            function(err, workout) {
                if (err)
                    res.send(err);
                res.json(workout);
        });
};