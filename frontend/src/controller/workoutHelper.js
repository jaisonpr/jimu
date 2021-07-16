'use strict';
import { WorkoutController } from './workoutController.js';
import { formatTime, formatTwoDigits } from '../util.js';
import { MONTHS, SPORTS } from '../constants.js';

const date = new Date();
const today = new Date();

function getWorkoutsDay(workouts, day) {

    let sum = 0;
    let workoutsDay = [];

    workouts.forEach(w => {
        let date = new Date(w.dateTime);
        if (date.getDate() == day) {
            sum += w.duration;
            workoutsDay.push(w);
        }
    });

    workoutsDay.sort(function (a, b) {
        return new Date(b.date) - new Date(a.date);
    });

    let dayObject = {
        "day": day,
        "sum": sum,
        "workouts": workoutsDay
    };

    return dayObject;
}


async function editWorkout(id) {

    let workouts = JSON.parse(sessionStorage.getItem("workouts"));
    let workout;

    workouts.forEach(w => {
        workout = workouts.find(({ _id }) => _id === id);
    });
    sessionStorage.setItem("workout", JSON.stringify(workout));

    $('#screenModal').modal('show').find('.modal-content').load('pages/workoutForm.html', function() {
        WorkoutController.initForm('edit');
    });    
}

function workoutToDocument(workout) {
    let dateTime = new Date(workout.dateTime);
    
    document.getElementById('title').value = workout.title;
    document.getElementById('date').value = `${dateTime.getFullYear()}-${formatTwoDigits(dateTime.getMonth() + 1)}-${formatTwoDigits(dateTime.getDate())}`;
    document.getElementById('time').value = `${formatTwoDigits(dateTime.getUTCHours())}:${formatTwoDigits(dateTime.getUTCMinutes())}`;
    document.getElementById('duration').value = (workout.duration < 100 ? '0' : '') + workout.duration;
    document.getElementById('sport').value = workout.sport;
    document.getElementById('local').value = workout.local;
}

// -- export functions --

function populateSportSelect() {

    let select = document.getElementById("sport");    
    for(let i = 0; i < SPORTS.length; i++) {
        let opt = SPORTS[i];
        let el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        select.appendChild(el);
    }
}

function jsonString(document) {
    return ` {
        "title"     : "${document.getElementById('title').value}",
        "dateTime"  : "${document.getElementById('date').value + "T" + document.getElementById('time').value + ":00.000Z"}",
        "duration"  : "${document.getElementById('duration').value}",
        "sport"     : "${document.getElementById('sport').value}",
        "local"     : "${document.getElementById('local').value}"
    }` ;
}

function initForm(action) {
    populateSportSelect();
    if (action == 'add') {

        let dateTime = new Date();

        let month = dateTime.getMonth() + 1;
        if (month < 10) month = '0' + month;
        let day = dateTime.getDate();
        if (day < 10) day = '0' + day;
        document.getElementById('date').value = `${dateTime.getFullYear()}-${month}-${day}`;

        $('#btnSave').on('click', function (e) {
            WorkoutController.save(document, 0);
        });
        
    } else if (action == 'edit') {

        let workout = JSON.parse(sessionStorage.getItem("workout"));

        workoutToDocument(workout);

        $('#btnDelete').click(function () {
            if (confirm('Are you sure?')) {
                WorkoutController.delete(workout._id);
            }
        });

        $('#btnSave').on('click', function (e) {
            WorkoutController.save(document, workout._id);
        });

        document.getElementById('btnDelete').style.display = "";
    }
    jQuery(function ($) {
        $("#date").mask("9999-99-99", { autoclear: false });
        $("#time").mask("99:99", { autoclear: false });
        $("#duration").mask("999", { autoclear: false });
    });
}


// -- calendar
let loadMethod ;

const renderCalendar = async (load) => {

    loadMethod = load;

    date.setDate(1);

    const year = date.getFullYear(); 
    const month = date.getMonth() + 1;

    /// month's workouts     
    let workouts = await load(`${year}-${month}-01`);    
    //

    const lastDay = new Date(year, month, 0).getDate();
    const prevLastDay = new Date(year, month -1, 0).getDate();
    const firstDayIndex = date.getDay();
    const lastDayIndex = new Date(year, month, 0).getDay();
    const nextDays = 7 - lastDayIndex - 1;

    document.querySelector(".date h1").innerHTML = MONTHS[date.getMonth()];

    let days = "";

    for (let x = firstDayIndex; x > 0; x--) {
        days += `<div class="prev-date">${prevLastDay - x + 1}</div>`;
    }

    let workouts_month = 0;
    let time_workouts_month = 0;

    for (let day = 1; day <= lastDay; day++) {

        /// day's workouts 
        let dayObject = getWorkoutsDay(workouts, day);
        //

        let listWorkouts = '';
        dayObject.workouts.forEach ( w => { 
            listWorkouts += `<li id="${w._id}" class="wd">${w.sport}</li>`; 
        } );

        workouts_month += dayObject.workouts.length;
        time_workouts_month += dayObject.sum;

        days += `
            <div id="day">       
                <div id="${( today.getMonth() === date.getMonth() && day === today.getDate() ) ? 'day_today': 'day_number'}">
                    ${day}
                </div>                  
                <div id="day_list">
                    <ul>
                        ${listWorkouts}
                    </ul> 
                </div>                  
                <div id="day_hours">
                    ${formatTime(dayObject.sum)}
                </div>                 
            </div>`;
    }

    for (let j = 1; j <= nextDays; j++) {
        days += `<div class="next-date">${j}</div>`;
    }
   
    document.querySelector(".days").innerHTML = days;

    //footer
    document.querySelector("#workouts_month").innerHTML = workouts_month;
    document.querySelector("#time_workouts_month").innerHTML = formatTime(time_workouts_month);

    let workoutsListDay = document.querySelectorAll("li.wd");    
    for (var i = 0; i < workoutsListDay.length; i++) {        
        let id = workoutsListDay[i].id;
        
        workoutsListDay[i].addEventListener("click", () => {
            editWorkout( id );
        });
    }
};

document.querySelector(".prev").addEventListener("click", () => {
    date.setMonth(date.getMonth() - 1);
    renderCalendar(loadMethod);
});

document.querySelector(".next").addEventListener("click", () => {
    date.setMonth(date.getMonth() + 1);
    renderCalendar(loadMethod);
});


export { populateSportSelect };
export { initForm };
export { jsonString };
export { workoutToDocument };
export { renderCalendar };