export function getNowYYYYMMDDTHHMMSS() {
    //get submit time
    const todayDateRaw = new Date();
    const month=todayDateRaw.getMonth()+1<10?`0${todayDateRaw.getMonth()+1}`:todayDateRaw.getMonth()+1;
    const day=todayDateRaw.getDate()<10?`0${todayDateRaw.getDate()}`:todayDateRaw.getDate();
    const hour=todayDateRaw.getHours()<10?`0${todayDateRaw.getHours()}`:todayDateRaw.getHours();
    const minute=todayDateRaw.getMinutes()<10?`0${todayDateRaw.getMinutes()}`:todayDateRaw.getMinutes();
    const second=todayDateRaw.getSeconds()<10?`0${todayDateRaw.getSeconds()}`:todayDateRaw.getSeconds();
    return `${todayDateRaw.getFullYear()}/${month}/${day}T${hour}:${minute}:${second}`;
}
export function getMinutesWorked(starttime, endtime, lunchtime) {
    // shortcut if endtime before starttime
    if ((new Date(endtime)).getTime()-(new Date(starttime)).getTime()<=0) return -1;
    // calculate time worked
    const lunchMillies = Number(String(lunchtime).substr(0,2)*60*1000);
    const milliesWorked = (new Date(endtime)).getTime()-(new Date(starttime)).getTime()-lunchMillies;
    // short cut is lunchtime greater than time worked
    if (milliesWorked<=0) return -2;
    //return minutes worked
    return Math.round((milliesWorked/60)/1000);
}
export function minutesToDigital(minutes) {
    const m = minutes % 60;  
    const h = (minutes-m)/60;   
    const dec = parseInt((m/6)*10, 10);
    return parseFloat(parseInt(h, 10) + '.' + (dec<10?'0':'') + dec);
}
export function minutesToText(minutes) {
    const minuteDisplay = minutes%60;
    const hoursDisplay = Math.floor(minutes/60);
    return `${hoursDisplay} hour${minuteDisplay!==1?'s':''} and ${minuteDisplay} min${minuteDisplay!==1?'s':''}`;
}
export function entryEditable(entry,adminEditTimesheets) {
    if (adminEditTimesheets) return true;
    if (entry.downloaded) return false;
    return ((new Date()).getTime()-(new Date(entry.timesubmitted)).getTime())<86400000;
}
export function getDateWorked(entry) {
    const entryDate = new Date(entry);
    const month=(entryDate.getMonth()+1)<10?`0${entryDate.getMonth()+1}`:entryDate.getMonth()+1;
    const date=(entryDate.getDate())<10?`0${entryDate.getDate()}`:entryDate.getDate();
    return `${entryDate.getFullYear()}-${month}-${date}`
}
export function isFutureDay(idate) {
    const idateMillies = (new Date(idate)).getTime();
    const today = new Date();
    today.setHours(23);
    today.setMinutes(59);
    today.setSeconds(59);
    return (today - idateMillies) < 0;
}
export function updateStartEndTimeFromEdit(dateofwork, newTime) {
    // return full date time
    return `${dateofwork}T${newTime}`
}
export function updateLunchTimeFromEdit(newLunchtime) {
    !newLunchtime?newLunchtime='0':newLunchtime=String(newLunchtime);
    // return number of minutes
    return Number(newLunchtime.substr(0,2));
}
export function militaryToAMPM(time) {
    let hours=time.split(':')[0];
    let ampm;
    if (hours<0) hours=hours+24;
    if (hours==='00' || hours===0) {hours='12'; ampm='AM'};
    if (hours>'12' || hours===12) {ampm='PM'};
    if (hours<12) {hours=Number(hours); ampm='AM'};
    if (hours>12) {hours=Number(hours)-12; ampm='PM'};
    return `${hours}:${time.split(':')[1]} ${ampm}`;
}
export function addZero(item) {
    if (item.length===1) return `0${item}`;
    return item;
}