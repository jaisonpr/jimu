'use strict';
import { BaseController } from './base.js';
import { renderCalendar, jsonString, initForm } from './workoutHelper.js';

var loadCalendarMonth = (async function (date) {
    let url = `${BaseController.getEndpoint()}/workouts/monthly/date=${date}`;
    return $.getJSON(url, function (data) {
        sessionStorage.setItem("workouts", JSON.stringify(data));
    });
});


class WorkoutController {

    static makeCalendar() {
        renderCalendar(loadCalendarMonth);
    }

    static initForm(action) {
        initForm(action);
    }

    static delete(id) {
        BaseController.sendDelete('workouts', id);
        WorkoutController.makeCalendar();
    }

    static save(id) {
        BaseController.sendSave('workouts', jsonString(), id);
        sessionStorage.removeItem("workout");
        WorkoutController.makeCalendar();
    }

}
export { WorkoutController };