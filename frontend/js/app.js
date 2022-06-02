import { WorkoutController } from '../src/controller/workoutController.js';
import { HistoryController } from '../src/controller/historyController.js';
import { StatisticsController } from '../src/controller/statisticsController.js';
import { MeasurementsController } from '../src/controller/measurementsController.js';


$('#linkHistory').on('click', function (e) {
    e.preventDefault();
    $('#screenModal').modal('show').find('.modal-content').load('pages/history/history.html', function() {
        HistoryController.initForm();
    });    
});

$('#linkSummary').on('click', function (e) {
    e.preventDefault();
    $('#screenModal').modal('show').find('.modal-content').load('pages/statistics/summary.html', function() {
        StatisticsController.initSummaryForm();
    });    
});

$('#linkChartSports').on('click', function (e) {
    e.preventDefault();
    $('#screenModal').modal('show').find('.modal-content').load('pages/statistics/chart_sports.html', function() {
        StatisticsController.initChartSportsForm();
    });    
});

$('#linkChartTimeMonthly').on('click', function (e) {
    e.preventDefault();
    $('#screenModal').modal('show').find('.modal-content').load('pages/statistics/chart_time_monthly.html', function() {
        StatisticsController.initChartTimeMonthly();
    });    
});

$('#linkChartTimeAnnual').on('click', function (e) {
    e.preventDefault();
    $('#screenModal').modal('show').find('.modal-content').load('pages/statistics/chart_time_annual.html', function() {
        StatisticsController.initChartTimeAnnual();
    });    
});

$('#linkMeasurementsBody').on('click', function (e) {
    e.preventDefault();
    $('#screenModal').modal('show').find('.modal-content').load('pages/measurements/body_list.html', function() {
        MeasurementsController.initBody();
    });    
});

$('#linkMeasurementsWeight').on('click', function (e) {
    e.preventDefault();
    $('#screenModal').modal('show').find('.modal-content').load('pages/measurements/weight_list.html', function() {
        MeasurementsController.initWeight();
    });    
});

$('#linkMeasurementFitness').on('click', function (e) {
    e.preventDefault();
    $('#screenModal').modal('show').find('.modal-content').load('pages/measurements/chart_fitness', function() {
        MeasurementsController.chartFitness();
    });    
});

$('#btnNewWorkout').on('click', function (e) {
    e.preventDefault();
    $('#screenModal').modal('show').find('.modal-content').load('pages/workouts/workout_form.html', function() {
        WorkoutController.initForm('add');
    });    
});

WorkoutController.makeCalendar();