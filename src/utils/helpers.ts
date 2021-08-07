/**
 * Calculates minutes worked
 * 
 * @param {string} starttime - The title of the book.
 * @param {string} endtime - The author of the book.
 * @param {number} lunchtime - The author of the book.
 * @returns {number} minutes worked
 */
export function getMinutesWorked(starttime: string, endtime: string, lunchtime: number):number {
    // validate for endtime before starttime
    if ((new Date(endtime)).getTime()-(new Date(starttime)).getTime()<=0) return -1;
    // calculate time worked
    const lunchMillies = Number(String(lunchtime).substr(0,2))*60*1000;
    const milliesWorked = (new Date(endtime)).getTime()-(new Date(starttime)).getTime()-lunchMillies;
    // validate for lunchtime greater than time worked
    if (milliesWorked<=0) return -2;
    //return minutes worked
    return Math.round((milliesWorked/60)/1000);
}
/**
 * Converts minutes to digital hours, i.e. 70 minutes = 1.17
 * 
 * @param {string or number} minutes - The title of the book.
 * @returns {float}
 */
export function minutesToDigital(minutes: any): number {
    const leftoverMinutes = minutes % 60;  
    const hours = (minutes-leftoverMinutes)/60;   
    const decimal = (leftoverMinutes/6)*10;
    return parseFloat(String(hours) + '.' + (decimal<10?'0':'') + String(decimal));
}
/**
 * Converts minutes to text i.e. 70 minutes = 1 hour and 10 minutes
 * 
 * @param {string or number} minutes
 * @returns {string}
 */
export function minutesToText(minutes: any): string {
    const minuteDisplay = minutes%60;
    const hoursDisplay = Math.floor(minutes/60);
    return `${hoursDisplay} hour${minuteDisplay!==1?'s':''} and ${minuteDisplay} min${minuteDisplay!==1?'s':''}`;
}
/**
 * Determines if entry was made less than 24 hours ago and is therefore still editable by the user
 * 
 * @param {object} entry
 * @param {boolean} adminEditTimesheets - if administrator is editing all entries are editable
 * @returns {boolean}
 */
export function entryEditable(entry: any, adminEditTimesheets: any): boolean {
    if (adminEditTimesheets) return true;
    if (entry.downloaded) return false;
    return ((new Date()).getTime()-(new Date(entry.timesubmitted)).getTime())<86400000;
}
/**
 * formats date-worked to YYYY-MM-DD
 * 
 * @param {object} entry - timesheet entry
 * @returns {string}
 */
export function getDateWorked(entry: any): string {
    const entryDate = new Date(entry);
    const month=(entryDate.getMonth()+1)<10?`0${entryDate.getMonth()+1}`:entryDate.getMonth()+1;
    const date=(entryDate.getDate())<10?`0${entryDate.getDate()}`:entryDate.getDate();
    return `${entryDate.getFullYear()}-${month}-${date}`
}
/**
 * Determines if date and time is tomorrow or later. A time later today would pass.
 * 
 * @param {any} idate - string or number that can be converted to a date
 * @returns {boolean}
 */
export function isFutureDay(idate: any): boolean {
    const idateMillies = (new Date(idate)).getTime();
    const today = new Date();
    today.setHours(23);
    today.setMinutes(59);
    today.setSeconds(59);
    const todayMillies = today.getTime();
    return (todayMillies - idateMillies) < 0;
}
/**
 * formats date to MongoDB preferred format of YYYY-MM-DDTHH:MM
 * 
 * @param {string} dateofwork - YYYY-MM-DD
 * @param {string} newTime - HH:MM
 * @returns {string}
 */
export function updateStartEndTimeFromEdit(dateofwork: any, newTime: any) {
    // return full date time
    return `${dateofwork}T${newTime}`
}
/**
 * returns number of minutes from lunchtime string
 * 
 * @param {string} newLunchtime - 60 minutes returns 60
 * @returns {string}
 */
export function updateLunchTimeFromEdit(newLunchtime: any) {
    !newLunchtime?newLunchtime='0':newLunchtime=String(newLunchtime);
    // return number of minutes
    return Number(newLunchtime.substr(0,2));
}
/**
 * Changes military time to AM and PM i.e. 17:20 returns 5:20pm
 * 
 * @param {string} time - expects 17:20 or 03:13
 * @returns {string}
 */
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
/**
 * inserts zero at the front of an item where length = 1, Used to convert months from 1 to 01
 * 
 * @param {any} item
 * @returns {string}
 */
export function addZero(item: any) {
    if (item.length===1) return `0${item}`;
    return item;
}