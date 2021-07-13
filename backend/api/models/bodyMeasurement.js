'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BodyMeasurement = new Schema({
  date: {
    type: Date,
    required: 'Enter the date'
  },
  height: {
    type: Number
  },
  weight: {
    type: Number,
    required: [true, 'Weight (Kg) ?']
  },
  neck: {
    type: Number
  },
  chest: {
    type: Number
  },
  abdomen: {
    type: Number
  },
  waist: {
    type: Number
  },
  hips: {
    type: Number
  },
  biceps: {
    type: Number
  },
  forearm: {
    type: Number
  },
  thigh: {
    type: Number
  },
  calf: {
    type: Number
  },
  Created_date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('BodyMeasurements', BodyMeasurement);