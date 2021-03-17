const { parseISO, isBefore, fromUnixTime } = require('date-fns');
const { format, utcToZonedTime } = require('date-fns-tz');

// function dateIsPast(date) {
//   const parsed = parseISO(date);
//   return isBefore(parsed, new Date().getTime());
// }

// console.log('dateIsPast', dateIsPast('2021-03-17T18:00:00.000Z'))
// console.log('dateIsPast', dateIsPast('2021-03-10T19:00:00.000Z'))


function dateToLocalTime(date, timeZone = 'America/New_York') {
  const parsed = parseISO(date);
  return format(parsed, "yyyy-MM-dd[T]HH:mm:ss[Z]", {
    timeZone
  });
}

console.log('time', dateToLocalTime('2021-03-17T18:00:00.000Z'))