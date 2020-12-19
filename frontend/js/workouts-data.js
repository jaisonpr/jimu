
function getSumWorkout() {
    return Math.floor(Math.random() * (5 - 1 + 1)) + 1;
}

function getWorkoutsDay(day) {

    let workoutJSON_mock1 = { 
        "title": "Karate", 
        "dateTime": new Date(),
        "duration": "80",
        "local": "Budokan",
        "sport": "Martial arts"
    };

    let workoutJSON_mock2 = { 
        "title": "coreP", 
        "dateTime": new Date(),
        "duration": "60",
        "local": "Casa",
        "sport": "Pilates"
    };

    let sum = getSumWorkout();

    let dayObject = { 
        "day": day,
        "sum": sum,
        "workouts": [workoutJSON_mock1, workoutJSON_mock2]
    };

    return dayObject;
}

