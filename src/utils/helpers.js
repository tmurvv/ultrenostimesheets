export function calcHoursWorked(dateofwork, starttime, endtime, lunchtime) {
    const startFullDate = new Date(`${dateofwork}T${String(starttime.substr(0,2))}:${String(starttime.substr(3,2))}:00`);
    const endFullDate = new Date(`${dateofwork}T${String(endtime.substr(0,2))}:${String(endtime.substr(3,2))}:00`);
    const lunchMillies = Number(String(lunchtime).substr(0,2)*60*1000);
    if (lunchMillies>endFullDate-startFullDate) return 'Lunch Time Error';
    const milliesWorked = endFullDate-startFullDate-lunchMillies;
    if (milliesWorked<=0) return 'End Time Error';
    const minutesWorked = (milliesWorked/60)/1000;
    const minuteDisplay = minutesWorked%60;
    const hoursDisplay = Math.floor(minutesWorked/60);
    
    return `${hoursDisplay} hour${minuteDisplay!==1?'s':''} and ${minuteDisplay} minute${minuteDisplay!==1?'s':''}`;
}