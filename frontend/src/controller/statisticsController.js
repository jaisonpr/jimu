'use strict';
import { BaseController } from './base.js';
import { populateSportSelect, basicFilterForm, formatInitialDate, formatFinalDate } from './helper/formHelper.js';
import { MONTHS, SPORTS, SPORTS_COLORS } from '../constants.js';
import { formatTime, month, arrayMonths } from '../util.js';

let labelsChart = [];
let chartSports;
let durationWorkouts = function(sum, {duration}) { return sum + duration; };

function dataChartTime() {
    let ret = [];
    let date = new Date();
    let dateIni = ( new Date( date.setFullYear( date.getFullYear() - 1))).toISOString().split('T')[0];
    let dateEnd = ( new Date()).toISOString().split('T')[0];

    let workouts = BaseController.sendQuery('workouts/monthly/interval', `dateInitial=${dateIni}&dateFinal=${dateEnd}`);
    workouts.forEach(workout => {
        labelsChart.push(workout._id);
        ret.push( Math.round(workout.totalDuration / 60 ));   
    });
    return ret;
}

function dataChartTimeAnnual(years) {
    let ret =[];
    years.forEach(year => {
        ret.push( BaseController.sendParam('workouts/annual/total', `year=${year}`));   
    });
    return ret;
}

function dataChartBySport(monthIni, monthEnd, sport) {    
    let ret =[];
    for (let month = monthIni; month <= monthEnd; month++) {  
        let dtMonthIni = `2021-${month}-01`;
        let dtMonthEnd = `2021-${month}-${ new Date('2021', (month - 1), 0).getDate()}`;
        let workouts =  BaseController.sendQuery('workouts', `title=&dateInitial=${dtMonthIni}&dateFinal=${dtMonthEnd}&local=&sport=${sport}`); 
        ret.push( workouts.reduce( durationWorkouts, 0) / 60);
    }
    return ret;
}

function dataSummary() {    
    return BaseController.sendQuery('workouts', 
        `title=&dateInitial=${formatInitialDate($('#dateIni').val())}&dateFinal=${formatFinalDate($('#dateFinal').val())}&local=&sport=`); 
}


class StatisticsController {

    static initSummaryForm() {
        basicFilterForm();
        $('#btnFilter').on('click', function (e) {
            StatisticsController.summarize();
        });
    }

    static initChartSportsForm() {
        populateSportSelect();
        basicFilterForm();
    
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
    
        let totalTime = 0, totalCount = 0;
        let html_table_body = '';

        SPORTS.forEach(sport => {
            let data = dataSummary();
            let filterWorkouts =  w => { return w.sport[0] === sport; };                                
            let count = data.filter( filterWorkouts ).length;
            let time = data.filter( filterWorkouts ).reduce( durationWorkouts, 0);   
            
            html_table_body += `
                <tr>
                    <td>${sport}</td>
                    <td>${count}</td>
                    <td>${formatTime(time)}</td>
                </tr>`;
            
            totalCount += count;
            totalTime += time;
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

    static initChartTimeMonthly() {

        const data = {
            labels: labelsChart,
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

    static initChartTimeAnnual() {

        let currentYear = new Date().getFullYear(); 
        let years = [];
        for (let year = 2013 ; year <= currentYear; year++) {
            years.push(year);
        }

        let arrSum = [];
        let arrCount = [];
        dataChartTimeAnnual(years).forEach(ret => {
            let hours = Math.round(ret[0].totalDuration / 60 );
            arrSum.push(hours);
            arrCount.push(ret[0].count);
        });

        const data = {
            labels: years,
            datasets: [
                {
                    label: 'Total time',
                    backgroundColor: 'rgb(175, 0, 0)',
                    borderColor: 'rgb(175, 0, 0)',
                    data: arrSum
                }
                // {
                //     label: 'Count',
                //     backgroundColor: 'rgb(37, 31, 244)',
                //     borderColor: 'rgb(37, 31, 244)',
                //     data: arrCount
                // }
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
      
        let monthIni = month($('#dateIni').val());
        let monthEnd = month($('#dateFinal').val());
        let data = [];
        
        sports.forEach(sport => {
            data.push( { 
                label: sport,  
                backgroundColor: SPORTS_COLORS[ SPORTS.indexOf(sport) ], 
                borderColor: SPORTS_COLORS[ SPORTS.indexOf(sport) ], 
                data: dataChartBySport(monthIni, monthEnd, sport)
            });
        });
     
        if (chartSports) {
            chartSports.destroy();
        }
        chartSports = new Chart(
            $('#chartSports'),
            {
                type: 'bar',
                data: {
                    labels: arrayMonths(monthIni, monthEnd),
                    datasets: data
                },
                options: {}
            }
        );
        
        $("#div-chart").show();     
    }
}
export { StatisticsController };