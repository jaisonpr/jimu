'use strict';
import { BaseController } from '../base.js';
import { formatTwoDigits } from '../../util.js';
import { AGE, HEIGHT } from '../../constants.js';

function calculateBMI(weight, height) {
    return weight / Math.pow(height / 100, 2);
}

function calculateBFP_BMI(weight, height, age) {
    return 1.2 * calculateBMI(weight, height) + 0.23 * age - 16.2;
}

function calculateBFP_Navy(height, neck, waist) {
    return (495 / (1.0324 - 0.19077 * Math.log10(waist-neck) + 0.15456 * Math.log10(height))) - 450;
}


export function jsonString() {
    let bmi = 0, bfp = 0, bfp_navy = 0;
    if ($('#height').val()) {
        bmi = calculateBMI( $('#weight').val(), $('#height').val() );
        bfp = calculateBFP_BMI( $('#weight').val(), $('#height').val(), AGE);
        bfp_navy = calculateBFP_Navy( $('#height').val(), $('#neck').val(), $('#waist').val() );
    }
    return ` {
        "date"      : "${$('#date').val() + "T00:00:00.000Z"}",
        "age"       : "${AGE}",
        "weight"    : "${$('#weight').val()}",
        "height"    : "${($('#height').val() ? $('#height').val() : 0)}",
        "neck"      : "${($('#neck').val() ? $('#neck').val() : 0)}",
        "chest"     : "${($('#chest').val() ? $('#chest').val() : 0)}",
        "waist"     : "${($('#waist').val() ? $('#waist').val() : 0)}",
        "hips"      : "${($('#hips').val() ? $('#hips').val() : 0)}",
        "biceps"    : "${($('#biceps').val() ? $('#biceps').val() : 0)}",
        "forearm"   : "${($('#forearm').val() ? $('#forearm').val() : 0)}",
        "thigh"     : "${($('#thigh').val() ? $('#thigh').val() : 0)}",
        "calf"      : "${($('#calf').val() ? $('#calf').val() : 0)}",
        "bmi"       : "${bmi}",
        "bfp"       : "${bfp}",
        "bfp_navy"  : "${bfp_navy}"
    }` ;
}

export function bodyToDocument(bodyMeasurements) {
    $('#date'   ).val(bodyMeasurements.date); 
    $('#age'    ).val(bodyMeasurements.age); 
    $('#weight' ).val(bodyMeasurements.weight); 
    $('#height' ).val(bodyMeasurements.height); 
    $('#neck'   ).val(bodyMeasurements.neck); 
    $('#chest'  ).val(bodyMeasurements.chest); 
    $('#abdomen').val(bodyMeasurements.abdomen); 
    $('#waist'  ).val(bodyMeasurements.waist); 
    $('#hips'   ).val(bodyMeasurements.hips); 
    $('#biceps' ).val(bodyMeasurements.biceps); 
    $('#forearm').val(bodyMeasurements.forearm); 
    $('#thigh'  ).val(bodyMeasurements.thigh); 
    $('#calf'   ).val(bodyMeasurements.calf); 
    $('#bmi'    ).val(bodyMeasurements.bmi); 
    $('#bfp'    ).val(bodyMeasurements.bfp); 
    $('#bfp_navy').val(bodyMeasurements.bfp_navy); 
}

export function initForm(action, body, isBody) {   
    let id = 0
    if (action == 'add') {
        let dateTime = new Date();
        let month = formatTwoDigits(dateTime.getMonth() + 1);
        let day = formatTwoDigits(dateTime.getDate());  
        $('#date').val(`${dateTime.getFullYear()}-${month}-${day}`); 
        $("#btnDelete").removeAttr("style").hide();
        
    } else if (action == 'edit') {
        id = body._id;               
        bodyToDocument(body);
        $('btnDelete').show();
        $('#btnDelete').click(function () {
            if (confirm('Are you sure?')) {
                BaseController.sendDelete('bodyMeasurements', body._id);
            }
        });
    }      
    $("#date"  ).mask("9999-99-99", { autoclear: false }); 
    $("#weight").mask("999.9", { autoclear: false });   
    if (isBody) {
        $("#height").val( HEIGHT );
        $("#date"   ).mask("9999-99-99", { autoclear: false });          
        $("#height" ).mask("999", { autoclear: false });  
        $("#weight" ).mask("999.9", { autoclear: false });      
        $("#neck"   ).mask("99", { autoclear: false });    
        $("#chest"  ).mask("999", { autoclear: false });    
        $("#waist"  ).mask("999", { autoclear: false });
        $("#hips"   ).mask("999", { autoclear: false });
        $("#biceps" ).mask("99", { autoclear: false });
        $("#forearm").mask("99", { autoclear: false }); 
        $("#thigh"  ).mask("99", { autoclear: false });
        $("#calf"   ).mask("99", { autoclear: false });
    }     
    $('#btnSave').on('click', function (e) {
        BaseController.sendSave('bodyMeasurements', jsonString(), id);
    });  
}
