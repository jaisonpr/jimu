'use strict';

const service = require('../services/bodyMeasurementService');

exports.listAll = function (req, res) {
    service.listAll(res);
};

exports.create = function (req, res) {
    service.create(req.body, res);
};

exports.getById = function (req, res) {
    service.getById(req.params.bodyMeasurementId, res);
};

exports.edit = function (req, res) {
    service.edit(req.params.bodyMeasurementId, req.body, res);
};

exports.delete = function (req, res) {
    service.delete(req.params.bodyMeasurementId, res);
};


exports.search = function (req, res) {
    let { dateInitial, dateFinal, onlyWeight } = req.query;
    
    service.search(dateInitial, dateFinal, onlyWeight, res);
};
