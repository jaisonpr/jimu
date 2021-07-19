'use strict';
import { BaseController } from './base.js';
import { renderCalendar, jsonString, initForm } from './workoutHelper.js';

const ENDPOINT = BaseController.getEndpoint() + 'workouts/';

var loadCalendarMonth = (async function (date) {
    return $.getJSON(ENDPOINT + 'monthly/date=' + date, function (data) {
        sessionStorage.setItem("workouts", JSON.stringify(data));
    });
});

var sendDelete = function (id) {
    $.ajax({
        url: ENDPOINT + id,
        type: 'DELETE'
    })
        .done(function () { console.log("deleteWorkout:success"); })
        .fail(function () { console.log("deleteWorkout:error"); })
        .always(function () { console.log("deleteWorkout:complete"); });
}

var sendSave = function(document, id) {
    $.ajax({
        url: ENDPOINT + (id === 0 ? '' : id),
        type: id === 0 ? 'POST' : 'PUT',
        contentType: "application/json",
        dataType: 'json',
        data: jsonString(document)
    })
        .done(function () { console.log("success"); })
        .fail(function () { console.log("error"); })
        .always(function () { console.log("complete"); });
}



class WorkoutController {

    static makeCalendar() {
        renderCalendar(loadCalendarMonth);
    }

    static initForm(action) {
        initForm(action);
    }

    static delete(id) {
        sendDelete(id);
        WorkoutController.makeCalendar();
    }

    static save(document, id) {
        sendSave(document, id);
        sessionStorage.removeItem("workout");
        WorkoutController.makeCalendar();
    }

}
export { WorkoutController };