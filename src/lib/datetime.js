const { format, parse, parseISO, isBefore, isAfter, getDay } = require('date-fns');

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
  'sunday': (date) => getDay(date) === 0,
  'monday': (date) => getDay(date) === 1,
  'tuesday': (date) => getDay(date) === 2,
  'wednesday': (date) => getDay(date) === 3,
  'thursday': (date) => getDay(date) === 4,
  'friday': (date) => getDay(date) === 5,
  'saturday': (date) => getDay(date) === 6
}

function dateIs(date, search) {
  search = search.toLowerCase();

  return dateIsVaues[search] && dateIsVaues[search](date);
}

module.exports.dateIs = dateIs;



/**
 * getDatetimeTime
 */

function getDatetimeTime(date, timeZone = 'America/New_York') {
  const parsed = parseISO(date);
  return format(parsed, "h:mmaaaaa'm'", {
    timeZone
  });
}

module.exports.getDatetimeTime = getDatetimeTime;

/**
 * getDatetimeMeridiem
 */

function getDatetimeMeridiem(date) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }

  const timestring = date.toLocaleTimeString('en-us');
  
  return timestring.split(' ').slice(-1)[0].toLowerCase();
}

module.exports.getDatetimeMeridiem = getDatetimeMeridiem

/**
 * getDatetimeShortDate
 */

function getDatetimeShortDate(date, timeZone = 'America/New_York') {
  const parsed = parseISO(date);
  return format(parsed, 'M/dd', {
    timeZone
  });
}

module.exports.getDatetimeShortDate = getDatetimeShortDate