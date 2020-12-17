
function loadCalendar() {
    let endpoint = "http://localhost:3000/workouts";
    
    $.ajax({
        url: endpoint,
        type: 'GET',
        contentType: "application/json",
        dataType: 'json'  })
        .done(function() {
            console.log("success");
        })
        .fail(function() {
            console.log("error");
        })
        .always(function() {
            console.log("complete");
        });
}