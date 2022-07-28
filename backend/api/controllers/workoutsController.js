'use strict';

const service = require('../services/workoutService');

exports.listAll = function (req, res) {
    service.listAll(res);
};

exports.create = function (req, res) {
    service.create(req.body, res);
};

exports.getById = function (req, res) {
    service.getById(req.params.workoutId, res);
};

exports.edit = function (req, res) {
    service.edit(req.params.workoutId, req.body, res);
};

exports.delete = function (req, res) {
    service.delete(req.params.workoutId, res);
};

exports.listMonthly = function (req, res) {

    let [year, month, day] = req.params.date.split("=")[1].split("-");
    let lastDay = new Date(year, month, 0).getDate();

    let startDate = `${year}-${month}-01 00:00:00`;
    let endDate = `${year}-${month}-${lastDay} 23:59:59`;

    service.listMonthly(startDate, endDate, res);
};

exports.totalAnnual = function (req, res) {
    
    let year = req.params.year;

    service.totalAnnual(year , res);
};


exports.search = function (req, res) {

    let { title, startDate, endDate, local, sport } = req.query;
    
    service.search(title, startDate, endDate, local, sport, res);
};


exports.listMonthlyInterval = function (req, res) {

    let {startDate, endDate} = req.query;

    service.listMonthlyInterval(startDate, endDate, res);
};



exports.test = function (req, res) {

    console.log(' exports.test = function (req, res) ');

    let {startDate, endDate} = req.query;

    const serviceResponse =  service.test(startDate, endDate, res);
    
    serviceResponse.then(string => res.send(string));
};