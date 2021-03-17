const { format, parseISO, isBefore, isAfter, getDay } = require('date-fns');
const { utcToZonedTime } = require('date-fns-tz');

/**
 * sortObjectsByDate
 */

function sortObjectsByDate(array, { key = 'date' } = {}) {
  return array.sort((a, b) => new Date(b[key]) - new Date(a[key]));
}

module.exports.sortObjectsByDate = sortObjectsByDate;

/**
 * dateIsPast
 */

function dateIsPast(date) {
  const parsed = parseISO(date);
  return isBefore(parsed, new Date().getTime());
}

module.exports.dateIsPast = dateIsPast;

/**
 * dateIsFuture
 */

function dateIsFuture(date) {
  const parsed = parseISO(date);
  return isAfter(parsed, new Date().getTime());
}

module.exports.dateIsFuture = dateIsFuture;

/**
 * dateIs
 */

const dateIsVaues = {
  'sunday': (date, timeZone) => {
    const parsed = utcToZonedTime(date, timeZone);
    return getDay(date) === 0
  },
  'monday': (date, timeZone) => {
    const parsed = utcToZonedTime(date, timeZone);
    return getDay(parsed) === 1;
  },
  'tuesday': (date, timeZone) => {
    const parsed = utcToZonedTime(date, timeZone);
    return getDay(parsed) === 2;
  },
  'wednesday': (date, timeZone) => {
    const parsed = utcToZonedTime(date, timeZone);
    return getDay(parsed) === 3;
  },
  'thursday': (date, timeZone) => {
    const parsed = utcToZonedTime(date, timeZone);
    return getDay(parsed) === 4;
  },
  'friday': (date, timeZone) => {
    const parsed = utcToZonedTime(date, timeZone);
    return getDay(parsed) === 5;
  },
  'saturday': (date, timeZone) => {
    const parsed = utcToZonedTime(date, timeZone);
    return getDay(parsed) === 6;
  }
}

function dateIs(date, search, timeZone = 'America/New_York') {
  search = search.toLowerCase();
  return dateIsVaues[search] && dateIsVaues[search](date, timeZone);
}

module.exports.dateIs = dateIs;


/**
 * getDatetimeTime
 */

function getDatetimeTime(date, timeZone = 'America/New_York') {
  const parsed = utcToZonedTime(date, timeZone);
  return format(parsed, "h:mmaaaaa'm'", {
    timeZone
  });
}

module.exports.getDatetimeTime = getDatetimeTime;

/**
 * getDatetimeShortDate
 */

function getDatetimeShortDate(date, timeZone = 'America/New_York') {
  const parsed = utcToZonedTime(date, timeZone);
  return format(parsed, 'M/dd', {
    timeZone
  });
}

module.exports.getDatetimeShortDate = getDatetimeShortDate