'use strict';
import { BaseController } from './base.js';
import { populateSportSelect } from './workoutHelper.js';
import { MONTHS, SPORTS, SPORTS_COLORS } from '../constants.js';
import { formatTime, formatTwoDigits, month, arrayMonths } from '../util.js';

let chartSports;
let durationWorkouts = function(sum, {duration}) { return sum + duration; };

function dataChartTime() {
    const year = new Date().getFullYear(); 
    let ret = [];
    for (let month = 1; month <= 12; month++) {
        let workouts = BaseController.sendParam('workouts/monthly', `date=${year}-${month}-01`);        
        ret.push( workouts.reduce( durationWorkouts, 0) / 60);
    }
    return ret;
}

function dataChartBySport(monthIni, monthEnd, sport) {    
    console.log(`${monthIni} ${monthEnd} ${sport}`);
    let ret =[];
    for (let month = monthIni; month <= monthEnd; month++) {        
        let dtMonthIni = `2021-${month}-01`;
        let dtMonthEnd = `2021-${month}-${ new Date('2021', (month - 1), 0).getDate()}`;
        let workouts =  BaseController.sendQuery('workouts', `title=&dateInitial=${dtMonthIni}&dateFinal=${dtMonthEnd}&local=&sport=${sport}`); 
        ret.push( workouts.reduce( durationWorkouts, 0) / 60);
    }
    return ret;
}

function dataSummary(dateIni, dateFinal) {    
    dateIni = `${dateIni}-01`;
    dateFinal = `${dateFinal}-${ new Date('2021', month(dateFinal), 0).getDate()}`;
    return BaseController.sendQuery('workouts', `title=&dateInitial=${dateIni}&dateFinal=${dateFinal}&local=&sport=`); 
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
    
        let totalTime = 0, totalCount = 0;
        let html_table_body = '';

        SPORTS.forEach(sport => {
            let count = 0, time = 0;
            let data = dataSummary( $('#dateIni').val(), $('#dateFinal').val() );
            let filterWorkouts =  w => { return w.sport[0] === sport; };  
                              
            count += data.filter( filterWorkouts ).length;
            totalCount += count;
            time += data.filter( filterWorkouts ).reduce( durationWorkouts, 0);   
            totalTime += time;
            
            html_table_body += `
                <tr>
                    <td>${sport}</td>
                    <td>${count}</td>
                    <td>${formatTime(time)}</td>
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