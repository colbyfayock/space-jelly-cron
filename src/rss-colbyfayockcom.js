require('dotenv').config();

const { readFeedFromUrl, promiseToConvertXmlToJson } = require('./lib/rss');
const { getRssData } = require('./lib/rss');
const { tweet } = require('./lib/twitter');

const RSS_URL = 'https://www.colbyfayock.com/feed.xml';

(async function run() {
  const { lastRun } = await getRssData();

  const feed = await readFeedFromUrl(RSS_URL);
  const json = await promiseToConvertXmlToJson(feed);

  const items = json.rss.channel[0].item;

  const newItems = items.filter(item => {
    const pubDate = item.pubDate[0];
    return new Date(pubDate) > new Date(lastRun);
  });

  if ( newItems.length > 0 ) {
    await Promise.all(newItems.map(async (item) => {
      const title = item.title[0];
      const link = item.link[0];

      const status = [
        '📝 New Post!',
        '',
        title,
        '',
        link
      ].join('\n');

      try {
        await tweet({
          status
        });
      } catch(e) {
        console.log(`Failed to tweet: ${e.message}`);
      }
    }))
  }
})();