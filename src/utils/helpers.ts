export function getMinutesWorked(starttime: string, endtime: string, lunchtime: number) {
    console.log(starttime,endtime,lunchtime)
    // validate for lunchtime
    if ((!lunchtime && lunchtime !== 0) || lunchtime<0 || isNaN(Number(lunchtime))) return -3;
    // validate if endtime before starttime
    if ((new Date(endtime)).getTime()-(new Date(starttime)).getTime()<=0) return -1;
    // manipulate
    const lunchMillies = Number(String(lunchtime).substr(0,2))*60*1000;
    const milliesWorked = (new Date(endtime)).getTime()-(new Date(starttime)).getTime()-lunchMillies;
    // validate is lunchtime greater than time worked
    if (milliesWorked<=0) return -2;
    if (isNaN(Math.round((milliesWorked/60)/1000))) return -3;
    //return minutes worked
    console.log(Math.round((milliesWorked/60)/1000))
    return Math.round((milliesWorked/60)/1000);
}
export function minutesToDigital(minutes: any) {
    // validate
    if (((!minutes) && minutes!==0 )|| minutes < 0 || isNaN(Number(minutes))) return 'Invalid Entry';
    // manipulate
    const leftoverMinutes = minutes % 60;  
    const h = (minutes-leftoverMinutes)/60;   
    const dec = (leftoverMinutes/6)*10;
    // return
    return parseFloat(String(h) + '.' + (dec<10?'0':'') + String(dec));
}
export function minutesToText(minutes: any) {
    // validate
    if (((!minutes) && minutes!==0 )|| minutes < 0 || isNaN(Number(minutes))) return '(could not find number of minutes worked)';
    // manipulate
    const minuteDisplay = minutes%60;
    const hoursDisplay = Math.floor(minutes/60);
    // return
    return `${hoursDisplay} hour${hoursDisplay!==1?'s':''} and ${minuteDisplay} min${minuteDisplay!==1?'s':''}`;
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
    if (!adminEditTimesheets && entry&&!entry.downloaded) return true;
    if (entry&&entry.downloaded) return false;
    return false;
}
export function isFutureDay(idate: any) {
    // not tested
    const idateMillies = (new Date(idate)).getTime();
    const today = new Date();
    today.setHours(23);
    today.setMinutes(59);
    today.setSeconds(59);
    const todayMillies = today.getTime();
    return (todayMillies - idateMillies) < 0;
}
export function updateLunchTimeFromEdit(newLunchtime: any) {
    // validate
    if (newLunchtime && newLunchtime.toUpperCase() === 'LUNCH TIME?') return 'Lunch Time?';
    if (!(newLunchtime) || newLunchtime.indexOf('minutes') === -1 || newLunchtime.substr(0,2) < 0) return 'Lunch Time?';
    // manipulate and return
    return Number(String(newLunchtime).substr(0,2));
}
/**
 * Changes military time to AM and PM i.e. 17:20 returns 5:20pm
 * 
 * @param {string} time - expects 17:20 or 03:13
 * @returns {string}
 */
export function militaryToAMPM(time: any) {
    // error function
    function error() {
        // log error
        console.log('From miltiartToAMPM: Invalid time entered.');
        return '--:--';
    }
    // validate
    if (!time) return error();
    if (!(time.split(':')[1] <= 59 && time.split(':')[1] >= 0)) return error();
    // manipulate
    let hours=time.split(':')[0];
    let ampm;
    if (hours>='12' || hours===12) {ampm='PM'};
    if (hours==='00' || hours===0) {hours='12'; ampm='AM'};
    if (hours<12) {hours=Number(hours); ampm='AM'};
    if (hours>12) {hours=Number(hours)-12; ampm='PM'};
    if (!(hours <= 12 && hours >= 0)) return error();
    // return
    return `${hours}:${time.split(':')[1]} ${ampm}`;
}
/**
 * inserts zero at the front of an item where length = 1, Used to convert months from 1 to 01
 * 
 * @param {any} item
 * @returns {string}
 */
export function addZero(item: any) {
    // manipulate
    item = String(item);
    // return
    if (item.length===1) return `0${item}`;
    return item;
}
export function checkJobsite(joblist: string[], editEntry: any) {
    // validate
    if (!editEntry) return false;
    // manipulate
    const fullJobName: string[] = [];
    joblist.forEach(job=>fullJobName.push(`${job[0]} ${job[1]}`));
    // check for jobsite in list
    return fullJobName.includes(editEntry.jobname);
}

export function getParams() {
    // window.location.search.substr(1).split('&').reduce(function (q, query) {
        
    //     const chunks = query.split('=');
    //     const key = chunks[0];
    //     const value =  decodeURIComponent(chunks[1]);
    //     // return (q[key] = value, q);
    // }, {});

    // window.location.search.substr(1).split('&').reduce(function (q, query) {
    //     var chunks = query.split('=');
    //     var key = chunks[0];
    //     var value = decodeURIComponent(chunks[1]);
    //     value = isNaN(Number(value))? value : Number(value);
    //     return (q[key] = value, q);
    // }, {});
} 
