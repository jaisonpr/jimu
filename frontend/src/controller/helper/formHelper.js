'use strict';
import { formatTwoDigits, month, year } from '../../util.js';
import { SPORTS } from '../../constants.js';
  

export function populateSportSelect(firstBlank) {
    if (firstBlank) {
        $("#sport").append(new Option("", ""));
    }
    SPORTS.forEach(s => {
        $("#sport").append(new Option(s, s));
    });
}

export function basicFilterForm() {    
    let dateTime = new Date();
    let month = formatTwoDigits(dateTime.getMonth() + 1);
    let day = formatTwoDigits(dateTime.getDate());  
    $('#startDate').val('2013-05'); 
    $("#startDate").mask("9999-99", { autoclear: false });
    $('#endDate').val(`${dateTime.getFullYear()}-${month}-${day}`); 
    $("#endDate").mask("9999-99", { autoclear: false }); 
};

export function formatInitialDate() {
    return `${$('#startDate').val()}-01`;
}

export function formatFinalDate() {
    let date = $('#endDate').val();
    return `${date}-${ new Date(year(date), month(date), 0).getDate()}`;
}

export function formatDateTime(dateTime) {
    return `${dateTime.toString().substring(0, 10)} ${dateTime.toString().substring(11, 16)}`;
}

export function formatDate(dateTime) {
    return `${dateTime.toString().substring(0, 10)}`;
}