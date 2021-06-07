const date = new Date();

const renderCalendar = async () => {
    date.setDate(1);

    const year = date.getFullYear(); 
    const month = date.getMonth() + 1;

    /// month's workouts 
    let workouts = await loadCalendar(`${year}-${month}-01`);
    
      
    const monthDays = document.querySelector(".days");

    const lastDay = new Date(
        year,
        month,
        0
    ).getDate();

    const prevLastDay = new Date(
        year,
        month -1,
        0
    ).getDate();

    const firstDayIndex = date.getDay();

    const lastDayIndex = new Date(
        year,
        month,
        0
    ).getDay();

    const nextDays = 7 - lastDayIndex - 1;

    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    document.querySelector(".date h1").innerHTML = months[date.getMonth()];

    let days = "";

    for (let x = firstDayIndex; x > 0; x--) {
        days += `<div class="prev-date">${prevLastDay - x + 1}</div>`;
    }

    let workouts_month = 0;
    let time_workouts_month = 0;

    for (let day = 1; day <= lastDay; day++) {

        /// day's workouts 
        let dayObject = getWorkoutsDay(workouts, day);

        let listWorkouts = '';
        dayObject.workouts.forEach ( w => { 
            listWorkouts += `<li id="${w._id}" onclick="editWorkout('${w._id}');">${w.sport}</li>`; 
        } );

        workouts_month += dayObject.workouts.length;
        time_workouts_month += dayObject.sum;

        days += `
            <div id="day">       
                <div id="day_number">
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
        monthDays.innerHTML = days;
    }

    //footer
    document.querySelector("#workouts_month").innerHTML = workouts_month;
    document.querySelector("#time_workouts_month").innerHTML = formatTime(time_workouts_month);
};

document.querySelector(".prev").addEventListener("click", () => {
    date.setMonth(date.getMonth() - 1);
    renderCalendar();
});

document.querySelector(".next").addEventListener("click", () => {
    date.setMonth(date.getMonth() + 1);
    renderCalendar();
});


renderCalendar();
