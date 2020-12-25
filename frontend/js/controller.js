
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
    console.log('saveWorkout :  ' + (id === 0 ? 'NEW' : 'ALT'));

    $.ajax({
        url: endpoint + (id === 0 ? '' : id),
        type: id === 0 ? 'POST' : 'PUT',
        contentType: "application/json",
        dataType: 'json',
        data: jsonString(document)
        })
        .done(function () {
            console.log("success");
        })
        .fail(function () {
            console.log("error");
        })
        .always(function () {
            console.log("complete");
    });
    
    
    localStorage.removeItem("workout");
}

async function loadCalendar(date) {

    return $.getJSON(endpoint + 'monthly/date=' + date, function (data) {
        sessionStorage.setItem("workouts", JSON.stringify(data));
    });
}

async function editWorkout(id) {

    //let workout = await $.getJSON(endpoint + id, function (data) {});
    let workouts = JSON.parse(sessionStorage.getItem("workouts"));
    let workout;

    workouts.forEach(w => {
        workout = workouts.find(({ _id }) => _id === id);
    });
    localStorage.setItem("workout", JSON.stringify(workout));

    $('#crudModal').modal('show').find('.modal-content').load('pages/edit.html');
}

function deleteWorkout(id) {
    console.log('delete');

    $.ajax({
        url: endpoint + id,
        type: 'DELETE'
    })
        .done(function () {
            console.log("success");
        })
        .fail(function () {
            console.log("error");
        })
        .always(function () {
            console.log("complete");
        });
}