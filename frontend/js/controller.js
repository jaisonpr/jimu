const endpoint = "http://localhost:3000/api/v1/workouts/";
let chartSports;

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

    renderCalendar();
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

function populateSportSelect() {

    select = document.getElementById("sport");    
    for(let i = 0; i < SPORTS.length; i++) {
        let opt = SPORTS[i];
        let el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        select.appendChild(el);
    }
}


function prepareForm() {
    populateSportSelect();

    jQuery(function ($) {
        $("#date").mask("9999-99-99", { autoclear: false });
        $("#time").mask("99:99", { autoclear: false });
        $("#duration").mask("999", { autoclear: false });
    });
}


function prepareAddForm() {
    dateTime = new Date();

    month = dateTime.getMonth() + 1;
    if (month < 10) month = '0' + month;
    day = dateTime.getDate();    
    if (day < 10) day = '0' + day;

    document.getElementById('date').value = `${dateTime.getFullYear()}-${month}-${day}`;

    prepareForm();
}

function prepareEditForm() {

    if (sessionStorage.getItem("workout")) {
        workout = JSON.parse(sessionStorage.getItem("workout"));
        dateTime = new Date(workout.dateTime);

        document.getElementById('title').value = workout.title;
        document.getElementById('date').value = `${dateTime.getFullYear()}-${formatTwoDigits(dateTime.getMonth() + 1)}-${formatTwoDigits(dateTime.getDate())}`;
        document.getElementById('time').value = `${formatTwoDigits(dateTime.getUTCHours())}:${formatTwoDigits(dateTime.getUTCMinutes())}`;
        document.getElementById('duration').value = (workout.duration < 100 ? '0' : '') + workout.duration;
        document.getElementById('sport').value = workout.sport;
        document.getElementById('local').value = workout.local;
        
        $('#bDelete').click( function() {
            if ( confirm('Are you sure?')) {
                deleteWorkout(workout._id);
                renderCalendar();
            }
        });
    }

    prepareForm();
}



function getWorkoutsMonth(monthIni, monthEnd, sport) {
    
    let workoutsMonth =[];

    for ( let m = monthIni; m <= monthEnd; m++) {
        let dtMonthIni = `2021-${m}-01`;
        let dtMonthEnd = `2021-${m}-${ new Date('2021', (m - 1), 0).getDate()}`;
        let query = `?title=&dateInitial=${dtMonthIni}&dateFinal=${dtMonthEnd}&local=&sport=${sport}`;
        let workoutsBySport = getAjaxByQuery(query);
        let sumTime = 0;
        for (let j = 0; j < workoutsBySport.length; j++) {
            sumTime += workoutsBySport[j].duration;
        }
        workoutsMonth.push(sumTime/60);
    }
    return workoutsMonth;
}


function chartBySport(sports) {

    let dateIni = document.getElementById('dateIni').value;
    let dateFinal = document.getElementById('dateFinal').value;
    let datasets = [];

    //label
    let labels = [];    
    monthIni = parseInt( dateIni.substring(5, 7) ) -1;
    monthEnd = parseInt( dateFinal.substring(5, 7) ) -1;
    for ( let m = monthIni; m <= monthEnd; m++) {
        labels.push( MONTHS[m] ); 
    }

    //data    
    monthIni++;
    monthEnd++;
    for (let i = 0; i < sports.length; i++) {
        let sport = { 
            label: sports[i],  
            backgroundColor: SPORTS_COLORS[ SPORTS.indexOf( sports[i] ) ], 
            borderColor: SPORTS_COLORS[ SPORTS.indexOf( sports[i] ) ], 
            data: getWorkoutsMonth(monthIni, monthEnd, sports[i])
        };        
        datasets.push( sport );
    }
 
    if (chartSports) {
        chartSports.destroy();
    }
    chartSports = new Chart(
		document.getElementById('chartSports'),
		{
            type: 'bar',
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {}
        }
	);
    
    document.getElementById('div-chart').style.visibility = 'visible';
}