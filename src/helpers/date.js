export default {
    dateToIso: dateToIso,
    utcDateToIso: utcDateToIso,
    dateToTime: dateToTime,
    utcDateToTime: utcDateToTime,
    dateTimeTz: dateTimeTz,
}

function dateToIso(d){
    var month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

function utcDateToIso(d){
    var month = '' + (d.getUTCMonth() + 1),
    day = '' + d.getUTCDate(),
    year = d.getUTCFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

function dateToTime(d){
    var hours = '' + d.getHours(),
    minutes = '' + d.getMinutes(),
    seconds = '00';

    if (hours.length < 2) hours = '0' + hours;
    if (minutes.length < 2) minutes = '0' + minutes;
    return [hours, minutes, seconds].join(':');
}


function utcDateToTime(d){
    var hours = '' + d.getUTCHours(),
    minutes = '' + d.getUTCMinutes(),
    seconds = '00';

    if (hours.length < 2) hours = '0' + hours;
    if (minutes.length < 2) minutes = '0' + minutes;
    return [hours, minutes, seconds].join(':');
}

function dateTimeTz(d){
    let tz = this.$store.getters.timeZone;
    if(!tz) throw 'Timezone not set yet';
    if(typeof d === 'string') d = new Date(d);

    return d.toLocaleString("en-US", {timeZone: tz})
}
