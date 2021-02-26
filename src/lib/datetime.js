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

function dateIsPast(date, offset = 0) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }

  return date < new Date(new Date().getTime() + offset);
}

module.exports.dateIsPast = dateIsPast;

/**
 * dateIsFuture
 */

function dateIsFuture(date, offset = 0) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }

  return date > new Date(new Date().getTime() + offset);
}

module.exports.dateIsFuture = dateIsFuture;

/**
 * dateToLocalTime
 * @via https://stackoverflow.com/questions/36206260/how-to-set-date-always-to-eastern-time-regardless-of-users-time-zone
 */

function dateToLocalTime(date, offset = -300) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }

  date.setTime(date.getTime() + date.getTimezoneOffset() * 60 * 1000);

  return new Date(date.getTime() + offset * 60 * 1000);
}

module.exports.dateToLocalTime = dateToLocalTime;

/**
 * dateIs
 */

const dateIsVaues = {
  'sunday': (date) => date.getDay() === 0,
  'monday': (date) => date.getDay() === 1,
  'tuesday': (date) => date.getDay() === 2,
  'wednesday': (date) => date.getDay() === 3,
  'thursday': (date) => date.getDay() === 4,
  'friday': (date) => date.getDay() === 5,
  'saturday': (date) => date.getDay() === 6
}

function dateIs(date, search) {
  search = search.toLowerCase();

  return dateIsVaues[search] && dateIsVaues[search](date);
}

module.exports.dateIs = dateIs;



/**
 * getDatetimeTime
 */

function getDatetimeTime(date) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }

  const timestring = date.toLocaleTimeString('en-us');
  return timestring.split(':').splice(0,2).join(':');
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

function getDatetimeShortDate(date) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }

  const datestring = date.toLocaleDateString();
  
  return datestring.split('/').splice(0,2).join('/');
}

module.exports.getDatetimeShortDate = getDatetimeShortDate