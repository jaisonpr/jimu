'use strict';

var mongoose = require('mongoose'),
    BodyMeasurement = mongoose.model('BodyMeasurements');


exports.listAll = function (res) {
    BodyMeasurement.find({}, function (err, bodyMeasurement) {
        if (err)
            res.send(err);
        res.json(bodyMeasurement);
    });
};


exports.create = function (data, res) {
    ( new BodyMeasurement(data)).save(function (err, bodyMeasurement) {
        if (err)
            res.send(err);
        res.json(bodyMeasurement);
    });
};


exports.getById = function (bodyMeasurementId, res) {
    BodyMeasurement.findById(bodyMeasurementId, function (err, bodyMeasurement) {
        if (err)
            res.send(err);
        res.json(bodyMeasurement);
    });
};


exports.edit = function (bodyMeasurementId, data, res) {
    BodyMeasurement.findOneAndUpdate({ _id: bodyMeasurementId }, data, { new: true }, function (err, bodyMeasurement) {
        if (err)
            res.send(err);
        res.json(bodyMeasurement);
    });
};


exports.delete = function (bodyMeasurementId, res) {
    BodyMeasurement.deleteOne({ _id: bodyMeasurementId }, function (err, bodyMeasurement) {
        if (err)
            res.send(err);
        res.json({ message: 'BodyMeasurement successfully deleted' });
    });
};


exports.search = function (dateInitial, dateFinal, onlyWeight, res) {
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
