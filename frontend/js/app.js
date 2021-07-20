import { WorkoutController } from '../src/controller/workoutController.js';
import { HistoryController } from '../src/controller/historyController.js';
import { StatisticsController } from '../src/controller/statisticsController.js';

$('#linkHistory').on('click', function (e) {
    e.preventDefault();
    $('#screenModal').modal('show').find('.modal-content').load('pages/history.html', function() {
        HistoryController.initForm();
    });    
});

$('#linkSummary').on('click', function (e) {
    e.preventDefault();
    $('#screenModal').modal('show').find('.modal-content').load('pages/summary.html', function() {
        StatisticsController.initSummaryForm();
    });    
});

$('#linkChartTime').on('click', function (e) {
    e.preventDefault();
    $('#screenModal').modal('show').find('.modal-content').load('pages/chart_time.html', function() {
        StatisticsController.initChartTime();
    });    
});

$('#linkChartSports').on('click', function (e) {
    e.preventDefault();
    $('#screenModal').modal('show').find('.modal-content').load('pages/chart_sports.html', function() {
        StatisticsController.initChartSportsForm();
    });    
});

$('#btnNewWorkout').on('click', function (e) {
    e.preventDefault();
    $('#screenModal').modal('show').find('.modal-content').load('pages/workout.html', function() {
        WorkoutController.initForm('add');
    });    
});


WorkoutController.makeCalendar();