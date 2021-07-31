export function getMinutesWorked(starttime: string, endtime: string, lunchtime: number):number {
    // shortcut if endtime before starttime
    if ((new Date(endtime)).getTime()-(new Date(starttime)).getTime()<=0) return -1;
    // calculate time worked
    const lunchMillies = Number(String(lunchtime).substr(0,2))*60*1000;
    const milliesWorked = (new Date(endtime)).getTime()-(new Date(starttime)).getTime()-lunchMillies;
    // short cut is lunchtime greater than time worked
    if (milliesWorked<=0) return -2;
    //return minutes worked
    return Math.round((milliesWorked/60)/1000);
}
export function minutesToDigital(minutes: any) {
    const leftoverMinutes = minutes % 60;  
    const h = (minutes-leftoverMinutes)/60;   
    const dec = (leftoverMinutes/6)*10;
    return parseFloat(String(h) + '.' + (dec<10?'0':'') + String(dec));
}
export function minutesToText(minutes: any) {
    const minuteDisplay = minutes%60;
    const hoursDisplay = Math.floor(minutes/60);
    return `${hoursDisplay} hour${minuteDisplay!==1?'s':''} and ${minuteDisplay} min${minuteDisplay!==1?'s':''}`;
}
export function entryEditable(entry: any, adminEditTimesheets: any) {
    if (adminEditTimesheets) return true;
    if (entry.downloaded) return false;
    return ((new Date()).getTime()-(new Date(entry.timesubmitted)).getTime())<86400000;
}
export function getDateWorked(entry: any) {
    const entryDate = new Date(entry);
    const month=(entryDate.getMonth()+1)<10?`0${entryDate.getMonth()+1}`:entryDate.getMonth()+1;
    const date=(entryDate.getDate())<10?`0${entryDate.getDate()}`:entryDate.getDate();
    return `${entryDate.getFullYear()}-${month}-${date}`
}
export function isFutureDay(idate: any) {
    const idateMillies = (new Date(idate)).getTime();
    const today = new Date();
    today.setHours(23);
    today.setMinutes(59);
    today.setSeconds(59);
    const todayMillies = today.getTime();
    return (todayMillies - idateMillies) < 0;
}
export function updateStartEndTimeFromEdit(dateofwork: any, newTime: any) {
    // return full date time
    return `${dateofwork}T${newTime}`
}
export function updateLunchTimeFromEdit(newLunchtime: any) {
    !newLunchtime?newLunchtime='0':newLunchtime=String(newLunchtime);
    // return number of minutes
    return Number(newLunchtime.substr(0,2));
}
export function militaryToAMPM(time: any) {
    let hours=time.split(':')[0];
    let ampm;
    if (hours<0) hours=hours+24;
    if (hours==='00' || hours===0) {hours='12'; ampm='AM'};
    if (hours>'12' || hours===12) {ampm='PM'};
    if (hours<12) {hours=Number(hours); ampm='AM'};
    if (hours>12) {hours=Number(hours)-12; ampm='PM'};
    return `${hours}:${time.split(':')[1]} ${ampm}`;
}
export function addZero(item: any) {
    if (item.length===1) return `0${item}`;
    return item;
}