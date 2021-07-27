'use strict';
import { BaseController } from './base.js';
import { formatTwoDigits, month, year } from '../util.js';
import { basicFilterForm, formatInitialDate, formatFinalDate, formatDate } from './formHelper.js';

function jsonString() {
    return ` {
        "date"      : "${$('#date').val() + "T00:00:00.000Z"}",
        "weight"    : "${$('#weight').val()}",
        "height"    : "${($('#height').val() ? $('#height').val() : 0)}",
        "neck"      : "${($('#neck').val() ? $('#neck').val() : 0)}",
        "chest"     : "${($('#chest').val() ? $('#chest').val() : 0)}",
        "abdomen"   : "${($('#abdomen').val() ? $('#abdomen').val() : 0)}",
        "waist"     : "${($('#waist').val() ? $('#waist').val() : 0)}",
        "hips"      : "${($('#hips').val() ? $('#hips').val() : 0)}",
        "biceps"    : "${($('#biceps').val() ? $('#biceps').val() : 0)}",
        "forearm"   : "${($('#forearm').val() ? $('#forearm').val() : 0)}",
        "thigh"     : "${($('#thigh').val() ? $('#thigh').val() : 0)}",
        "calf"      : "${($('#calf').val() ? $('#calf').val() : 0)}"
    }` ;
}

function bodyToDocument(bodyMeasurements) {
    let dateTime = new Date(bodyMeasurements.date);        
    $('#date').val(`${dateTime.getFullYear()}-${formatTwoDigits(dateTime.getMonth() + 1)}-${formatTwoDigits(dateTime.getDate())}`); 
    $('#weight').val(bodyMeasurements.weight); 
    $('#height').val(bodyMeasurements.height); 
    $('#neck').val(bodyMeasurements.neck); 
    $('#chest').val(bodyMeasurements.chest); 
    $('#abdomen').val(bodyMeasurements.abdomen); 
    $('#waist').val(bodyMeasurements.waist); 
    $('#hips').val(bodyMeasurements.hips); 
    $('#biceps').val(bodyMeasurements.biceps); 
    $('#forearm').val(bodyMeasurements.forearm); 
    $('#thigh').val(bodyMeasurements.thigh); 
    $('#calf').val(bodyMeasurements.calf); 
}


class MeasurementsController {

    static initWeight() {
        basicFilterForm();

        $('#btnFilter').on('click', function (e) {
            MeasurementsController.filterWeight();
        });
        $('#btnNew').on('click', function (e) {
            $('#screenModal').modal('show').find('.modal-content').load('pages/weight_form.html', function() {
                MeasurementsController.initWeightForm();
            });    
        });
               
    }

    static initWeightForm() {        
        let dateTime = new Date();
        let month = formatTwoDigits(dateTime.getMonth() + 1);
        let day = formatTwoDigits(dateTime.getDate());  
        $('#date').val(`${dateTime.getFullYear()}-${month}-${day}`); 
        $("#date").mask("9999-99-99", { autoclear: false }); 
        $("#weight").mask("999", { autoclear: false });        
        $("#btnDelete").removeAttr("style").hide();
        $('#btnSave').on('click', function (e) {
            MeasurementsController.saveWeight(0);
        });
    }

    static saveWeight(id) {
        BaseController.sendSave('bodyMeasurements', jsonString(), id);
    }

    static delete(id) {
        BaseController.sendDelete('bodyMeasurements', id);
    }

    static filterWeight() {     
        let weights = BaseController.sendQuery('bodyMeasurements', 
            `dateInitial=${formatInitialDate($('#dateIni').val())}&`+
            `dateFinal=${formatFinalDate($('#dateFinal').val())}`);
        
        weights.map( function(w) { 
            w.date = formatDate(w.date);
            return w; 
        });

        
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
            let object = $('#table-weight').DataTable().row( this ).data();
            let weight = weights.find(({ _id }) => _id === object._id);

            $('#screenModal').modal('show').find('.modal-content').load('pages/weight_form.html', function() {                
                bodyToDocument(weight);
                $('btnDelete').show();
                $('#btnSave').on('click', function (e) {
                    MeasurementsController.saveWeight(weight._id);
                });
                $('#btnDelete').click(function () {
                    if (confirm('Are you sure?')) {
                        MeasurementsController.delete(weight._id);
                    }
                });
            });    
        } );
    }
}
export { MeasurementsController };