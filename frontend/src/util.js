'use strict';
  
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

