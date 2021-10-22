const { getRssData, updateRssData } = require('./lib/rss');

(async function run() {
  console.log('=== Begin RSS Cleanup ===')

  console.log('Reading previous RSS data...');

  const data = await getRssData();

  console.log(JSON.stringify(data, null, 2));

  data.lastRun = new Date().toUTCString();

  console.log('Writing new RSS data...');

  await updateRssData(data);

  console.log(JSON.stringify(data, null, 2));

  console.log('=== End RSS Cleanup ===')
})();