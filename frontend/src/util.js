'use strict';
import { MONTHS } from './constants.js';
  
export function formatTwoDigits(num) {
    return (num < 10 ? '0' : '') + num;
};

export function formatTime(num) {
    let hours = (num / 60);
    let rhours = Math.floor(hours);
    let minutes = (hours - rhours) * 60;
    let rminutes = Math.round(minutes);
    return formatTwoDigits(rhours) + ":" + formatTwoDigits(rminutes);
};

export function month(str) {
    return parseInt(str.substring(5, 7));
}

export function year(str) {
    return parseInt(str.substring(0, 4));
}

export function arrayMonths(monthIni, monthEnd) {
    let months = []; monthIni--; monthEnd--;
    for ( let m = monthIni; m <= monthEnd; m++) {
        months.push( MONTHS[m] ); 
    }
    return months;
}