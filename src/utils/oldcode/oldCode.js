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