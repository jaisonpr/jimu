'use strict';

var mongoose = require('mongoose'),
    BodyMeasurement = mongoose.model('BodyMeasurements');


exports.listAll = function (req, res) {
    BodyMeasurement.find({}, function (err, bodyMeasurement) {
        if (err)
            res.send(err);
        res.json(bodyMeasurement);
    });
};


exports.create = function (req, res) {
    ( new BodyMeasurement(req.body)).save(function (err, bodyMeasurement) {
        if (err)
            res.send(err);
        res.json(bodyMeasurement);
    });
};


exports.getById = function (req, res) {
    BodyMeasurement.findById(req.params.bodyMeasurementId, function (err, bodyMeasurement) {
        if (err)
            res.send(err);
        res.json(bodyMeasurement);
    });
};


exports.edit = function (req, res) {
    BodyMeasurement.findOneAndUpdate({ _id: req.params.bodyMeasurementId }, req.body, { new: true }, function (err, bodyMeasurement) {
        if (err)
            res.send(err);
        res.json(bodyMeasurement);
    });
};


exports.delete = function (req, res) {
    BodyMeasurement.deleteOne({ _id: req.params.bodyMeasurementId }, function (err, bodyMeasurement) {
        if (err)
            res.send(err);
        res.json({ message: 'BodyMeasurement successfully deleted' });
    });
};


exports.search = function (req, res) {
    let { dateInitial, dateFinal, onlyWeight } = req.query;
    let query = {};

    if (dateInitial != '')  {
        query.date = {
            $gte: new Date(`${dateInitial} 00:00:00`),
            $lte: new Date(`${dateFinal} 23:59:59`)
        }
    }
    query.bmi = (onlyWeight === 'true') ? { $eq : 0 } : { $gt : 0 } ;

    BodyMeasurement
        .find( query ) 
        .sort( { 'date': 'asc' } )
        .exec( 
            function(err, obj) {
                if (err)
                    res.send(err);
                res.json(obj);
        });
};
