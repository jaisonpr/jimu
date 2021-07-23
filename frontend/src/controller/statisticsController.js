'use strict';
import { BaseController } from './base.js';
import { populateSportSelect } from './workoutHelper.js';
import { MONTHS, SPORTS, SPORTS_COLORS } from '../constants.js';
import { formatTime, formatTwoDigits, month } from '../util.js';

let chartSports;
let durationWorkouts = function(sum, {duration}) { return sum + duration; };


function getWorkouts(month, sport) {
    let dtMonthIni = `2021-${month}-01`;
    let dtMonthEnd = `2021-${month}-${ new Date('2021', (month - 1), 0).getDate()}`;
    return BaseController.sendQuery('workouts', `title=&dateInitial=${dtMonthIni}&dateFinal=${dtMonthEnd}&local=&sport=${sport}`); 
}

function dataChartTime() {

    const year = new Date().getFullYear(); 

    let ret = [];
    for (var month = 1; month <= 12; month++) {
        let workouts = BaseController.sendParam('workouts/monthly', `date=${year}-${month}-01`);        
        ret.push( workouts.reduce( durationWorkouts, 0) / 60);
    }
    return ret;
}

function dataChartBySport(monthIni, monthEnd, sport) {
    
    let ret =[];

    for ( let m = monthIni; m <= monthEnd; m++) {        
        let workouts = getWorkouts(m, sport);
        ret.push( workouts.reduce( durationWorkouts, 0) / 60);
    }
    return ret;
}

function dataSummary(monthIni, monthEnd, sport) {
    
    let ret =[];

    for ( let m = monthIni; m <= monthEnd; m++) {             
        let workouts = getWorkouts(m, sport);
        let objret = {
            sport: sport,
            count: workouts.length,
            time: workouts.reduce( durationWorkouts, 0)
        }; 
        ret.push(objret);
    }
    return ret;
}



class StatisticsController {

    static initSummaryForm() {
        let dateTime = new Date();
        $('#dateIni').val('2021-01');
        $('#dateFinal').val(`${dateTime.getFullYear()}-${formatTwoDigits(dateTime.getMonth()+1)}`);
        $("#dateIni").mask("9999-99", { autoclear: false });
        $("#dateFinal").mask("9999-99", { autoclear: false });    
        $('#btnFilter').on('click', function (e) {
            StatisticsController.summarize();
        });
    }

    static initChartSportsForm() {
        populateSportSelect();

        let dateTime = new Date();

        $('#dateIni').val('2021-01'); 
        $('#dateFinal').val(`${dateTime.getFullYear()}-${ formatTwoDigits(dateTime.getMonth() + 1) }`); 
        $("#dateIni").mask("9999-99", { autoclear: false });
        $("#dateFinal").mask("9999-99", { autoclear: false }); 
    
        $('#btnAll').on('click', function (e) {
            $("#sport option").prop("selected", true);
        });
        $('#btnClean').on('click', function (e) {
            $("#sport option:selected").prop("selected", false);
        });
        $('#btnFilter').on('click', function (e) {
            StatisticsController.chartBySport($('#sport').val());
        });
    }

    static summarize() {        
    
        let totalTime = 0;
        let totalCount = 0;
        let html_table_body = '';

        SPORTS.forEach(sport => {
            
            let workoutTimes = dataSummary(
                month($('#dateIni').val()), 
                month($('#dateFinal').val()), 
                sport);
            
            let countWorkout = 0;
            let timeWorkout = 0;
            workoutTimes.forEach(w => {               
                timeWorkout += w.time;
                countWorkout += w.count;
            });
            totalTime += timeWorkout;
            totalCount += countWorkout;

            html_table_body += `
                <tr>
                    <td>${sport}</td>
                    <td>${countWorkout}</td>
                    <td>${formatTime(timeWorkout)}</td>
                </tr>`;
        });
                
        $("#div-table-summary").show();     
        $('#table-summary-body').html(html_table_body);   
        $('#total').html(`workouts: <b>${totalCount}</b> time: <b>${formatTime(totalTime)}</b>`);
            
        if ( $.fn.dataTable.isDataTable( '#table-summary' ) ) {
            $('#table-summary').DataTable();
        } else {
            $('#table-summary').DataTable( { searching: false, paging: false, info: false } );
        }
    }

    static initChartTime() {

        const data = {
            labels: MONTHS,
            datasets: [
                {
                    label: 'Total time',
                    backgroundColor: 'rgb(175, 0, 0)',
                    borderColor: 'rgb(175, 0, 0)',
                    data: dataChartTime()
                }
            ]
        };
        const config = {
            type: 'line',
            data,
            options: {}
        };
    
        var chartTime = new Chart(
            $('#chartTime'),
            config
        );
    }


    static chartBySport(sports) {
    
        //label
        let labels = [];    
        let monthIni = month($('#dateIni').val()) -1;
        let monthEnd = month($('#dateFinal').val()) -1;
        for ( let m = monthIni; m <= monthEnd; m++) {
            labels.push( MONTHS[m] ); 
        }
    
        //data    
        let datasets = [];
        monthIni++;
        monthEnd++;
        for (let i = 0; i < sports.length; i++) {
            let sport = { 
                label: sports[i],  
                backgroundColor: SPORTS_COLORS[ SPORTS.indexOf( sports[i] ) ], 
                borderColor: SPORTS_COLORS[ SPORTS.indexOf( sports[i] ) ], 
                data: dataChartBySport(monthIni, monthEnd, sports[i])
            };        
            datasets.push( sport );
        }
     
        if (chartSports) {
            chartSports.destroy();
        }
        chartSports = new Chart(
            $('#chartSports'),
            {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: datasets
                },
                options: {}
            }
        );
        
        $("#div-chart").show();     
    }
}
export { StatisticsController };