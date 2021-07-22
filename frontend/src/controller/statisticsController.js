'use strict';
import { BaseController } from './base.js';
import { populateSportSelect } from './workoutHelper.js';
import { MONTHS, SPORTS, SPORTS_COLORS } from '../constants.js';
import { formatTime, formatTwoDigits } from '../util.js';

let chartSports;

function getMonthlyWorkoutsPerYear() {

    const year = new Date().getFullYear(); 

    let ret = [];
    for (var month = 1; month <= 12; month++) {

        let workouts = BaseController.getByParam('workouts/monthly', `date=${year}-${month}-01`);
        
        let totalTime = 0;
        for (var i = 0; i < workouts.length; i++) {
            totalTime += workouts[i].duration;
        }
        totalTime = totalTime / 60;
        ret.push(totalTime);
    }
    return ret;
}

function getWorkoutsMonth(monthIni, monthEnd, sport) {
    
    let workoutsMonth =[];

    for ( let m = monthIni; m <= monthEnd; m++) {
        let dtMonthIni = `2021-${m}-01`;
        let dtMonthEnd = `2021-${m}-${ new Date('2021', (m - 1), 0).getDate()}`;
        let workoutsBySport = BaseController.getByQuery('workouts', 
            `title=&dateInitial=${dtMonthIni}&dateFinal=${dtMonthEnd}&local=&sport=${sport}`);
        
        let sumTime = 0;
        for (let j = 0; j < workoutsBySport.length; j++) {
            sumTime += workoutsBySport[j].duration;
        }
        workoutsMonth.push(sumTime/60);
    }
    return workoutsMonth;
}


class StatisticsController {

    static initSummaryForm() {

        let dateTime = new Date();
        let month = formatTwoDigits( dateTime.getMonth() + 1);
        let day = formatTwoDigits( dateTime.getDate());
        
        $('#dateIni').val('2021-01-01');
        $('#dateFinal').val(`${dateTime.getFullYear()}-${month}-${day}`);
        $("#dateIni").mask("9999-99", { autoclear: false });
        $("#dateFinal").mask("9999-99", { autoclear: false });    

        $('#btnFilter').on('click', function (e) {
            StatisticsController.summarize();
        });
    }

    static summarize() {        
    
        let totalTime = 0;
        let totalAmount = 0;
        let html_table_body = '';
        for (let i = 0; i < SPORTS.length; i++) {
    
            let workoutsBySport = BaseController.getByQuery('workouts', 
                `title=&dateInitial=${$('#dateIni').val()}&dateFinal=${$('#dateFinal').val()}&local=&sport=${SPORTS[i]}`);
    
            let sumTime = 0;
            for (let j = 0; j < workoutsBySport.length; j++) {
                sumTime += workoutsBySport[j].duration;
            }
            totalTime += sumTime;
            totalAmount += workoutsBySport.length; 
    
            html_table_body += `
                <tr>
                    <td>${SPORTS[i]}</td>
                    <td>${workoutsBySport.length}</td>
                    <td>${formatTime(sumTime)}</td>
                </tr>`;
        }    
                
        $("#div-table-summary").show();     
        $('#table-summary-body').html(html_table_body);   
        $('#total').html(`workouts: <b>${totalAmount}</b> time: <b>${formatTime(totalTime)}</b>`);
            
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
                    data: getMonthlyWorkoutsPerYear()
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

    static chartBySport(sports) {
    
        //label
        let labels = [];    
        let monthIni = parseInt( $('#dateIni').val().substring(5, 7) ) -1;
        let monthEnd = parseInt( $('#dateFinal').val().substring(5, 7) ) -1;
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
                data: getWorkoutsMonth(monthIni, monthEnd, sports[i])
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