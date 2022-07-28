'use strict';
import { BaseController } from './base.js';
import { basicFilterForm, formatInitialDate, formatFinalDate, formatDate } from './helper/formHelper.js';
import { MONTHS } from '../constants.js';
import { initForm } from './helper/measurementsHelper.js';

function dataWeight(startDate, endDate) {
    return BaseController.sendQuery('bodyMeasurements', 
        `startDate=${startDate}&endDate=${endDate}&onlyWeight=true`)
        .map( function(body) { 
            body.date = formatDate(body.date);
            return body; 
        });;
}

function dataBody(startDate, endDate) {
    return BaseController.sendQuery('bodyMeasurements', 
        `startDate=${startDate}&endDate=${endDate}&onlyWeight=false`)
        .map( function(body) { 
            body.date = formatDate(body.date);
            body.bmi = body.bmi.toFixed(2);
            body.bfp = body.bfp.toFixed(2);
            body.bfp_navy = body.bfp_navy.toFixed(2);
            return body; 
        });;
}

function dataFitness() {
    console.log("\t\t\t\t\t dataFitness ");
}

class MeasurementsController {

    static initWeight() {
        basicFilterForm();

        $('#btnFilter').on('click', function (e) {
            MeasurementsController.filterWeight();
        });
        $('#btnNew').on('click', function (e) {
            $('#screenModal').modal('show').find('.modal-content').load('pages/measurements/weight_form.html', function() {
                MeasurementsController.initWeightForm('add');
            });    
        });
               
    }

    static initWeightForm(action, weight) {     
        initForm(action, weight);
    }

    static filterWeight() {     
        let weights = dataWeight( formatInitialDate($('#startDate').val()), formatFinalDate($('#endDate').val()));
        $('#table-weight').DataTable( {
            searching: false,
            data: weights, 
            columns: [
                { data: 'date' }, 
                { data: 'weight' },
            ]
        });
        $('#div-table-weight').show();

        $('#table-weight tbody').on('click', 'tr', function () {
            let weightRow = $('#table-weight').DataTable().row( this ).data();

            $('#screenModal').modal('show').find('.modal-content').load('pages/weight_form.html', function() {     
                initForm('edit', weights.find(({ _id }) => _id === weightRow._id) );
            });
        });
    }

    static initBody() {
        basicFilterForm();

        $('#btnFilter').on('click', function (e) {
            MeasurementsController.filterBody();
        });
        $('#btnNew').on('click', function (e) {
            $('#screenModal').modal('show').find('.modal-content').load('pages/measurements/body_form.html', function() {
                MeasurementsController.initBodyForm('add');
            });    
        });
    }

    static initBodyForm(action, body) {     
        initForm(action, body, true);
    }


    static filterBody() {     
        let measurements = dataBody( formatInitialDate($('#startDate').val()), formatFinalDate($('#endDate').val()));
        $('#table-weight').DataTable( {
            searching: false,
            data: measurements, 
            columns: [
                { data: 'date' }, 
                { data: 'weight' },
                { data: 'bmi' },
                { data: 'bfp' },
                { data: 'bfp_navy' },
            ]
        });
        $('#div-table-weight').show();

        $('#table-weight tbody').on('click', 'tr', function () {
            let bodyRow = $('#table-weight').DataTable().row( this ).data();

            $('#screenModal').modal('show').find('.modal-content').load('pages/measurements/body_form.html', function() {     
                initForm('edit', measurements.find(({ _id }) => _id === bodyRow._id) );
            });
        });
    }

    static chartFitness() {

        const data = {
            labels: MONTHS,
            datasets: [
                {
                    label: 'Total time',
                    backgroundColor: 'rgb(175, 0, 0)',
                    borderColor: 'rgb(175, 0, 0)',
                    data: dataFitness()
                }
            ]
        };
        const config = {
            type: 'line',
            data,
            options: {}
        };
    
        var chartTime = new Chart(
            $('#chartFitness'),
            config
        );
    }
}
export { MeasurementsController };