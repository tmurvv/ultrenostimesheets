// import {
//     getMinutesWorked,
//     minutesToDigital,
//     minutesToText,
//     entryEditable,
//     isFutureDay,
//     updateLunchTimeFromEdit,
//     militaryToAMPM,
//     addZero,
//     checkJobsite,
//     cleanHiddenCharacters,
//     cleanCommas,
// } from './helpers'
//
// test("getMinutesWorked()- Calculates from starttime, endtime, lunchtime", () => {
//     expect(getMinutesWorked('2021-08-03T17:53:00.000Z', '2021-08-03T20:53:00.000Z', 0)).toBe(180);
//     expect(getMinutesWorked('2021-08-03T17:53:00.000Z', '2021-08-03T20:53:00.000Z', 60)).toBe(120);
//     expect(getMinutesWorked('2021-08-03T08:53:00.000Z', '2021-08-03T13:33:00.000Z', 0)).toBe(280);
//     expect(getMinutesWorked('2021-08-03T08:53:00.000Z', '2021-08-03T13:33:00.000Z', 45)).toBe(235);
//     expect(getMinutesWorked('2021-08-03T00:00:00.000Z', '2021-08-03T20:53:00.000Z', 0)).toBe(1253);
//     expect(getMinutesWorked('2021-08-03T20:30:00.000Z', '2021-08-04T00:30:00.000Z', 0)).toBe(240);
//     expect(getMinutesWorked('2021-0asdf8-03T20:30:00.000Z', '2021-08-04T00:30:00.000Z', 0)).toBe(-3);
//     expect(getMinutesWorked('2021-08-03T20:30:00.000Z', '2021-08-04T00:3lkdle0:00.000Z', 0)).toBe(-3);
//     expect(getMinutesWorked('2021-08-03T20:30:00.000Z', '2021-08-04T00:30:00.000Z', -14)).toBe(-3);
//     expect(getMinutesWorked()).toBe(-3);
// });
// test("minutesToDigital()- Changes time format to 6.45", () => {
//     expect(minutesToDigital(83)).toBe(1.38);
//     expect(minutesToDigital('83')).toBe(1.38);
//     expect(minutesToDigital(15)).toBe(.25);
//     expect(minutesToDigital(387)).toBe(6.45);
//     expect(minutesToDigital(1387)).toBe(23.11);
//     expect(minutesToDigital(138700)).toBe(2311.66);
//     expect(minutesToDigital(0)).toBe(0);
//     expect(minutesToDigital('0')).toBe(0);
//     expect(minutesToDigital()).toBe('Invalid Entry');
//     expect(minutesToDigital('random string')).toBe('Invalid Entry');
//     expect(minutesToDigital(-4)).toBe('Invalid Entry');
//     expect(minutesToDigital('-4')).toBe('Invalid Entry');
// });
// test("minutesToText()- Changes time format to '3 hours and 7 mins'", () => {
//     expect(minutesToText(83)).toBe('1 hour and 23 mins');
//     expect(minutesToText('83')).toBe('1 hour and 23 mins');
//     expect(minutesToText(15)).toBe('0 hours and 15 mins');
//     expect(minutesToText(387)).toBe('6 hours and 27 mins');
//     expect(minutesToText(1387)).toBe('23 hours and 7 mins');
//     expect(minutesToText(138700)).toBe('2311 hours and 40 mins');
//     expect(minutesToText(0)).toBe('0 hours and 0 mins');
//     expect(minutesToText('0')).toBe('0 hours and 0 mins');
//     expect(minutesToText()).toBe('(could not find number of minutes worked)');
//     expect(minutesToText('random string')).toBe('(could not find number of minutes worked)');
//     expect(minutesToText(-4)).toBe('(could not find number of minutes worked)');
//     expect(minutesToText('-4')).toBe('(could not find number of minutes worked)');
// });
// test('entryEditable() - Is entry editable', () => {
//     expect(entryEditable({downloaded: true}, true)).toBe(true);
//     expect(entryEditable({downloaded: true}, false)).toBe(false);
//     expect(entryEditable({downloaded: false}, true)).toBe(true);
//     expect(entryEditable({downloaded: false}, false)).toBe(true);
//     expect(entryEditable()).toBe(false);
// });
// //function updateLunchTimeFromEdit
// test('Convert lunchtime select box entries to a number', () => {
//     expect(updateLunchTimeFromEdit('0 minutes')).toBe(0);
//     expect(updateLunchTimeFromEdit('15 minutes')).toBe(15);
//     expect(updateLunchTimeFromEdit('90 minutes')).toBe(90);
//     expect(updateLunchTimeFromEdit('Lunch Time?')).toBe('Lunch Time?');
//     expect(updateLunchTimeFromEdit('')).toBe('Lunch Time?');
//     expect(updateLunchTimeFromEdit(null)).toBe('Lunch Time?');
//     expect(updateLunchTimeFromEdit(undefined)).toBe('Lunch Time?');
//     expect(updateLunchTimeFromEdit('random string')).toBe('Lunch Time?');
//     expect(updateLunchTimeFromEdit('-13 minutes')).toBe('Lunch Time?');
// });
// //function militaryToAMPM
// test('Military Time to Standard Time (AM/PM)', () => {
//     expect(militaryToAMPM('17:52')).toBe('5:52 PM');
//     expect(militaryToAMPM('08:03')).toBe('8:03 AM');
//     expect(militaryToAMPM('12:00')).toBe('12:00 PM');
//     expect(militaryToAMPM('00:00')).toBe('12:00 AM');
//     expect(militaryToAMPM('11:59')).toBe('11:59 AM');
//     expect(militaryToAMPM('23:59')).toBe('11:59 PM');
//     expect(militaryToAMPM('')).toBe('--:--');
//     expect(militaryToAMPM('24:00')).toBe('12:00 PM');
//     expect(militaryToAMPM('25:00')).toBe('--:--');
//     expect(militaryToAMPM(null)).toBe('--:--');
//     expect(militaryToAMPM(undefined)).toBe('--:--');
//     expect(militaryToAMPM('13:61')).toBe('--:--');
//     expect(militaryToAMPM('-13:51')).toBe('--:--');
//     expect(militaryToAMPM('13:-51')).toBe('--:--');
// });
// // function addZero
// test('Insert 0 at front of item of length 1.', () => {
//     expect(addZero(1)).toBe('01');
//     expect(addZero('1')).toBe('01');
//     expect(addZero(15)).toBe('15');
//     expect(addZero('15')).toBe('15');
//     expect(addZero(1500)).toBe('1500');
//     expect(addZero('1500')).toBe('1500');
//     expect(addZero('#')).toBe('0#');
//     expect(addZero('random_string')).toBe('random_string');
// });
// // function checkJobsite()
// test('Checks that jobsite is in joblist', () => {
//     expect(checkJobsite([['13525', 'Bert'], ['C3253d', 'Ernie'], ['32563', 'Big Bird']], {jobname: 'C3253d Ernie'})).toBe(true);
//     expect(checkJobsite([['13525', 'Bert'], ['C3253d', 'Ernie'], ['32563', 'Big Bird']], {jobname: '32563 Big Bird'})).toBe(true);
//     expect(checkJobsite([['13525', 'Bert'], ['C3253d', 'Ernie'], ['32563', 'Big Bird']], {jobname: '325ds63 Big Bird'})).toBe(false);
//     expect(checkJobsite([['13525', 'Bert'], ['C3253d', 'Ernie'], ['32563', 'Big Bird']], {jobname: 'jekcs Oscar'})).toBe(false);
//     expect(checkJobsite([], {jobname: 'jekcs Oscar'})).toBe(false);
//     expect(checkJobsite([])).toBe(false);
//     expect(checkJobsite([], '')).toBe(false);
//     expect(checkJobsite()).toBe(false);
// });
