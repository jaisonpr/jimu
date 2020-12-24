function timeConvert(num) {
    let hours = (num / 60);
    let rhours = Math.floor(hours);
    let minutes = (hours - rhours) * 60;
    let rminutes = Math.round(minutes);
    return rhours + ":" + rminutes;
}


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
        "sum": timeConvert(sum),
        "workouts": workoutsDay
    };

    return dayObject;
}

