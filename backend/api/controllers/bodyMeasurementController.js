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
