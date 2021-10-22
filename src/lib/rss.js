const fs = require('fs').promises;
const fetch = require('node-fetch');
const { parseString } = require('xml2js');

const PATH_TO_RSS_DATA = './data/rss.json';

/**
 * getRssData
 */

async function getRssData() {
  const data = await fs.readFile(PATH_TO_RSS_DATA, 'utf8');
  const json = JSON.parse(data);
  return json;
}

module.exports.getRssData = getRssData;

/**
 * updateRssData
 */

async function updateRssData(json) {
  await fs.writeFile(PATH_TO_RSS_DATA, JSON.stringify(json), 'utf8')
  return json;
}

module.exports.updateRssData = updateRssData;

/**
 * promiseToConvertXmlToJson
 */

function promiseToConvertXmlToJson(xml) {
  const errorBase = `Failed to convert XML to JSON`;
  return new Promise((resolve, reject) => {
    parseString(xml, function (error, result) {
    if ( error ) {
      reject(`${errorBase} ${error}`);
      return;
    }
    resolve(result);
    });
  })
}

module.exports.promiseToConvertXmlToJson = promiseToConvertXmlToJson;

/**
 * readFeedFromUrl
 */

async function readFeedFromUrl(url) {
  const response = await fetch(url);
  const text = await response.text();
  return text;
}

module.exports.readFeedFromUrl = readFeedFromUrl;