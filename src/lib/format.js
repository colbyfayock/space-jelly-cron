/**
 * maxLength
 */

function maxLength(string, max) {
  if ( string.length <= max ) return string;

  string = string.slice(0, max);
  string = `${string.trim()}...`;

  return string;
}

module.exports.maxLength = maxLength;