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
export function getMinutesWorked(dateofwork, starttime, endtime, lunchtime) {
    const startFullDate = new Date(`${dateofwork}T${String(starttime.substr(0,2))}:${String(starttime.substr(3,2))}:00`);
    const endFullDate = new Date(`${dateofwork}T${String(endtime.substr(0,2))}:${String(endtime.substr(3,2))}:00`);
    const lunchMillies = Number(String(lunchtime).substr(0,2)*60*1000);
    if (endFullDate-startFullDate<0) return -1;
    const milliesWorked = endFullDate-startFullDate-lunchMillies;
    if (milliesWorked<=0) return -2;
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
    
    return `${hoursDisplay} hour${minuteDisplay!==1?'s':''} and ${minuteDisplay} minute${minuteDisplay!==1?'s':''}`;
}