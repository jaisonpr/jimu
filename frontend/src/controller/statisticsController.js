'use strict';
import { BaseController } from './base.js';
import { populateSportSelect } from './workoutHelper.js';
import { MONTHS, SPORTS, SPORTS_COLORS } from '../constants.js';
import { formatTime } from '../util.js';



const ENDPOINT = BaseController.getEndpoint() + 'workouts/';
let chartSports;

function getAjaxByQuery(query) {
    let ret = [];
    $.ajax({
            url:  ENDPOINT + query ,
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



class StatisticsController {

    static initSummaryForm() {

        let dateTime = new Date();

        let month = dateTime.getMonth() + 1;
        if (month < 10) month = '0' + month;
        let day = dateTime.getDate();    
        if (day < 10) day = '0' + day;

        document.getElementById('dateIni').value = '2021-01-01';
        document.getElementById('dateFinal').value = `${dateTime.getFullYear()}-${month}-${day}`;


        jQuery(function ($) {
                $("#dateIni").mask("9999-99-99", { autoclear: false });
                $("#dateFinal").mask("9999-99-99", { autoclear: false });
            });
        
        $('#btnFilter').on('click', function (e) {
            StatisticsController.summarize();
        });
    }

    static summarize() {
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
        
        document.querySelector("#table-summary-body").innerHTML = html;    
        document.getElementById('div-table-summary').style.display = "";
        
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
            document.getElementById('chartTime'),
            config
        );
    }

    static initChartSportsForm() {
        populateSportSelect();

        let dateTime = new Date();

        let month = dateTime.getMonth() + 1;
        if (month < 10) month = '0' + month;

        document.getElementById('dateIni').value = '2021-01';
        document.getElementById('dateFinal').value = `${dateTime.getFullYear()}-${month}`;

        jQuery(function ($) {
            $("#dateIni").mask("9999-99", { autoclear: false });
            $("#dateFinal").mask("9999-99", { autoclear: false });
        });

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

        let dateIni = document.getElementById('dateIni').value;
        let dateFinal = document.getElementById('dateFinal').value;
        let datasets = [];
    
        //label
        let labels = [];    
        let monthIni = parseInt( dateIni.substring(5, 7) ) -1;
        let monthEnd = parseInt( dateFinal.substring(5, 7) ) -1;
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
        
        document.getElementById('div-chart').style.display = "";
    }
}
export { StatisticsController };