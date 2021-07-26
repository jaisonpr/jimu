'use strict';
import { formatTwoDigits, month, year } from '../util.js';
import { SPORTS } from '../constants.js';
  

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
    $('#dateIni').val('2021-01'); 
    $("#dateIni").mask("9999-99", { autoclear: false });
    $('#dateFinal').val(`${dateTime.getFullYear()}-${month}-${day}`); 
    $("#dateFinal").mask("9999-99", { autoclear: false }); 
};

export function formatInitialDate() {
    return `${$('#dateIni').val()}-01`;
}

export function formatFinalDate() {
    let date = $('#dateFinal').val();
    return `${date}-${ new Date(year(date), month(date), 0).getDate()}`;
}
