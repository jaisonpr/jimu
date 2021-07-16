import { WorkoutController } from '../src/controller/workoutController.js';

const workoutController = new WorkoutController(); 
WorkoutController.makeCalendar();

$('#btnNewWorkout').on('click', function (e) {
    e.preventDefault();
    $('#screenModal').modal('show').find('.modal-content').load('pages/workoutForm.html', function() {
        WorkoutController.initForm('add');
    });    
});

$('#linkHistory').on('click', function (e) {
    e.preventDefault();
    $('#screenModal').modal('show').find('.modal-content').load('pages/history_filter.html');
});

$('#linkSummary').on('click', function (e) {
    e.preventDefault();
    $('#screenModal').modal('show').find('.modal-content').load('pages/summary_filter.html');
});

$('#linkChartTime').on('click', function (e) {
    e.preventDefault();
    $('#screenModal').modal('show').find('.modal-content').load('pages/chart_time.html');
});

$('#linkChartSports').on('click', function (e) {
    e.preventDefault();
    $('#screenModal').modal('show').find('.modal-content').load('pages/chart_sports.html');
});
