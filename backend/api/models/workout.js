'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var WorkoutSchema = new Schema({
  title: {
    type: String,
    required: 'Enter the title'
  },
  dateTime: {
    type: Date,
    required: 'Enter the date time'
  },
  duration: {
    type: Number,
    required: 'Enter the time'
  },
  local: {
    type: String,
    required: 'Enter the local'
  },
  sport: {
    type: [{
      type: String,
      enum: ['Pilates', 'Weight', 'Circuit', 'Martial arts']
    }],
    default: ['Circuit']
  },
  Created_date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Workouts', WorkoutSchema);