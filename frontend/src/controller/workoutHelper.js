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

    $('#screenModal').modal('show').find('.modal-content').load('pages/workout.html', function() {
        WorkoutController.initForm('edit');
    });    
}

function workoutToDocument(workout) {
    let dateTime = new Date(workout.dateTime);
    
    $('#title').val(workout.title); 
    $('#date').val(`${dateTime.getFullYear()}-${formatTwoDigits(dateTime.getMonth() + 1)}-${formatTwoDigits(dateTime.getDate())}`); 
    $('#time').val(`${formatTwoDigits(dateTime.getUTCHours())}:${formatTwoDigits(dateTime.getUTCMinutes())}`); 
    $('#duration').val((workout.duration < 100 ? '0' : '') + workout.duration); 
    $('#sport').val(workout.sport); 
    $('#local').val(workout.local); 
}

// -- exported functions --

function populateSportSelect(firstBlank) {
    if (firstBlank) {
        $("#sport").append(new Option("", ""));
    }
    SPORTS.forEach(s => {
        $("#sport").append(new Option(s, s));
    });
}

function jsonString() {
    return ` {
        "title"     : "${$('#title').val()}",
        "dateTime"  : "${$('#date').val() + "T" + $('#time').val() + ":00.000Z"}",
        "duration"  : "${$('#duration').val()}",
        "sport"     : "${$('#sport').val()}",
        "local"     : "${$('#local').val()}"
    }` ;
}


function initForm(action) {
    populateSportSelect();
    let id = 0
    if (action == 'add') {

        let dateTime = new Date();
        let month = formatTwoDigits(dateTime.getMonth() + 1);
        let day = formatTwoDigits(dateTime.getDate());    

        $('#date').val(`${dateTime.getFullYear()}-${month}-${day}`); 
        $("#btnDelete").removeAttr("style").hide();
        
    } else if (action == 'edit') {

        let workout = JSON.parse(sessionStorage.getItem("workout"));
        id = workout._id;

        workoutToDocument(workout);

        $('#btnDelete').click(function () {
            if (confirm('Are you sure?')) {
                WorkoutController.delete(id);
            }
        });
        $('btnDelete').show();
    }
    
    $('#btnSave').on('click', function (e) {
        WorkoutController.save(id);
    });    
    $("#date").mask("9999-99-99", { autoclear: false });
    $("#time").mask("99:99", { autoclear: false });
    $("#duration").mask("999", { autoclear: false });
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

    $(".date h1").html(MONTHS[date.getMonth()]);

    let html_days = "";

    for (let x = firstDayIndex; x > 0; x--) {
        html_days += `<div class="prev-date">${prevLastDay - x + 1}</div>`;
    }

    let workouts_month = 0;
    let time_workouts_month = 0;

    for (let day = 1; day <= lastDay; day++) {

        /// day's workouts 
        let dayObject = getWorkoutsDay(workouts, day);
        //

        let li_workouts = '';
        dayObject.workouts.forEach ( w => { 
            li_workouts += `<li id="${w._id}" class="wd">${w.sport}</li>`; 
        } );

        workouts_month += dayObject.workouts.length;
        time_workouts_month += dayObject.sum;

        html_days += `
            <div id="day">       
                <div id="${( today.getMonth() === date.getMonth() && day === today.getDate() ) ? 'day_today': 'day_number'}">
                    ${day}
                </div>                  
                <div id="day_list">
                    <ul>
                        ${li_workouts}
                    </ul> 
                </div>                  
                <div id="day_hours">
                    ${formatTime(dayObject.sum)}
                </div>                 
            </div>`;
    }

    for (let j = 1; j <= nextDays; j++) {
        html_days += `<div class="next-date">${j}</div>`;
    }
   
    $(".days").html(html_days);
    $("li.wd").each( function(){
        $(this).on("click", function(){
            editWorkout( this.id );
        });
    });
    //footer
    $('#workouts_month').html(workouts_month);   
    $('#time_workouts_month').html( formatTime(time_workouts_month));   
};

$(".prev").click( () => {
    date.setMonth(date.getMonth() - 1);
    renderCalendar(loadMethod);
});

$(".next").click( () => {
    date.setMonth(date.getMonth() + 1);
    renderCalendar(loadMethod);
});


export { populateSportSelect };
export { initForm };
export { jsonString };
export { workoutToDocument };
export { renderCalendar };