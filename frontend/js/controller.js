
const endpoint = "http://localhost:3000/api/v1/workouts/";

function jsonString(document) {
    return ` {
        "title"     : "${document.getElementById('title').value}",
        "dateTime"  : "${document.getElementById('date').value + "T" + document.getElementById('time').value + ":00.000Z"}",
        "duration"  : "${document.getElementById('duration').value}",
        "sport"     : "${document.getElementById('sport').value}",
        "local"     : "${document.getElementById('local').value}"
    }` ;
}

function saveWorkout(document, id) {
    $.ajax({
        url: endpoint + (id === 0 ? '' : id),
        type: id === 0 ? 'POST' : 'PUT',
        contentType: "application/json",
        dataType: 'json',
        data: jsonString(document)
        })
        .done(function () {   console.log("success");     })
        .fail(function () {   console.log("error");       })
        .always(function () { console.log("complete");    });
        
    sessionStorage.removeItem("workout");
}

async function loadCalendar(date) {

    return $.getJSON(endpoint + 'monthly/date=' + date, function (data) {
        sessionStorage.setItem("workouts", JSON.stringify(data));
    });
}

async function editWorkout(id) {

    let workouts = JSON.parse(sessionStorage.getItem("workouts"));
    let workout;

    workouts.forEach(w => {
        workout = workouts.find(({ _id }) => _id === id);
    });
    sessionStorage.setItem("workout", JSON.stringify(workout));

    $('#screenModal').modal('show').find('.modal-content').load('pages/edit.html');
}

function deleteWorkout(id) {
    $.ajax({
        url: endpoint + id,
        type: 'DELETE'
        })
        .done(function ()   {   console.log("success");     })
        .fail(function ()   {   console.log("error");       })
        .always(function () {   console.log("complete");    });
}


function getAjaxByQuery(query) {
    let ret = [];
    $.ajax({
        url:  endpoint + query ,
        type: 'GET',
        contentType: "application/json",
        dataType: 'json',
        async: false,
        })
        .done(function (data) {
            ret = data;
        })
        .fail(function () {   console.log("error");       })
        .always(function () { console.log("complete");    });

    return ret;
}


function filterHistory() {

    let title = document.getElementById('title').value;
    let dateIni = document.getElementById('dateIni').value;
    let dateFinal = document.getElementById('dateFinal').value;
    let local = document.getElementById('local').value;
    let sport = document.getElementById('sport').value;

    let query = `?title=${title}&dateInitial=${dateIni}&dateFinal=${dateFinal}&local=${local}&sport=${sport}`; 
    let workouts = getAjaxByQuery(query);

    workouts.forEach(w => {
        w.dateTime = `${w.dateTime.toString().substring(0, 10)} ${w.dateTime.toString().substring(11, 16)}`;
    });
    sessionStorage.setItem("history_workouts", JSON.stringify(workouts));

    $('#screenModal').modal('show').find('.modal-content').load('pages/history_result.html');
}

function getMonthlyWorkoutsPerYear() {

    const year = new Date().getFullYear(); 

    let ret = [];
    for (var month = 1; month <= 12; month++) {

        let query = `monthly/date=${year}-${month}-01`;
        let workouts = getAjaxByQuery(query);
        
        let totalTime = 0;
        for (var i = 0; i < workouts.length; i++) {
            totalTime += workouts[i].duration;
        }
        totalTime = totalTime / 60;
        ret.push(totalTime);
    }
    return ret;
}

function filterSummary() {

    let dateIni = document.getElementById('dateIni').value;
    let dateFinal = document.getElementById('dateFinal').value;

    let totalTime = 0;
    let totalAmount = 0;
    let html = '';
    for (let i = 0; i < SPORTS.length; i++) {

        let query = `?title=&dateInitial=${dateIni}&dateFinal=${dateFinal}&local=&sport=${SPORTS[i]}`;
        let workoutsBySport = getAjaxByQuery(query);

        let sumTime = 0;
        for (let j = 0; j < workoutsBySport.length; j++) {
            sumTime += workoutsBySport[j].duration;
        }
        totalTime += sumTime;
        totalAmount += workoutsBySport.length; 

        html += `<tr>
                    <td>${SPORTS[i]}</td>
                    <td>${workoutsBySport.length}</td>
                    <td>${formatTime(sumTime)}</td>
                </tr>`;
    }    
    html += `<tr>
                <td></td>
                <td>${totalAmount}</td>
                <td>${formatTime(totalTime)}</td>
            </tr>`;

    document.querySelector("#table-summary-body").innerHTML = html;    
    document.getElementById('div-table-summary').style.visibility = 'visible';
}
