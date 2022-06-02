'use strict';

var mongoose = require('mongoose'),
    Workout = mongoose.model('Workouts');


exports.listAll = function (res) {
    Workout.find({}, function (err, workout) {
        if (err)
            res.send(err);
        res.json(workout);
    });
};


exports.create = function (data, res) {
    ( new Workout(data)).save(function (err, workout) {
        if (err)
            res.send(err);
        res.json(workout);
    });
};


exports.getById = function (workoutId, res) {
    Workout.findById(workoutId, function (err, workout) {
        if (err)
            res.send(err);
        res.json(workout);
    });
};


exports.edit = function (workoutId, data, res) {
    Workout.findOneAndUpdate({ _id: workoutId }, data, { new: true }, function (err, workout) {
        if (err)
            res.send(err);
        res.json(workout);
    });
};


exports.delete = function (workoutId, res) {
    Workout.deleteOne({ _id: workoutId }, function (err, workout) {
        if (err)
            res.send(err);
        res.json({ message: 'Workout successfully deleted' });
    });
};


exports.listMonthly = function (startDate, endDate, res) {

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


exports.search = function (title, dateInitial, dateFinal, local, sport, res) {

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


exports.totalAnnual = function (year, res) {    
    let startDate = `${year}-01-01 00:00:00`;
    let endDate = `${year}-12-31 23:59:59`;

    Workout.aggregate(
        [            
            { $match: {
                dateTime: { $gte: new Date(startDate), $lte: new Date(endDate)  } }
            },
            { $group: {
                _id: null,
                count: { $sum: 1 },
                totalDuration: { $sum: '$duration' }
            }}
        ], 
        function (err, result) {
            if (err)
                res.send(err);
            res.json(result);
        });
};


exports.listMonthlyInterval = function (startDate, endDate, res) {
    
    Workout.aggregate(
        [         
            { $match: {
                dateTime: { $gte: new Date(startDate), $lte: new Date(endDate)  } 
            }},
            { $group: {
                _id: { $dateToString: { format: "%Y-%m", date: "$dateTime" } },
                count: { $sum: 1 },
                totalDuration: { $sum: '$duration' }
            }},
            { $sort: { 
                "_id": 1 
            }}
        ], 
        function (err, result) {
            if (err)
                res.send(err);                
            res.json(result);
        });
};

