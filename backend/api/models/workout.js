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
      enum: [
        'Abs',
        'Bike indoor',
        'Bike outdoor',
        'Pilates',
        'Weight',
        'Circuit',
        'Martial arts',
        'Stretching', 
        'Swimming', 
        'Walking',
        'Yoga',
        'Hiking'
      ]
    }],
    default: ['Circuit']
  },
  Created_date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Workouts', WorkoutSchema);