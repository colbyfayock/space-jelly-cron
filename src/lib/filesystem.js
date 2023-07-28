const fs = require('fs').promises;

/**
 * getRssData
 */

async function getJsonByPath(filePath) {
  const data = await fs.readFile(filePath, 'utf8');
  const json = JSON.parse(data);
  return json;
}

module.exports.getJsonByPath = getJsonByPath;

/**
 * updateRssData
 */

async function updateJsonByPath(json, filePath) {
  await fs.writeFile(filePath, JSON.stringify(json), 'utf8')
  return json;
}

module.exports.updateJsonByPath = updateJsonByPath;