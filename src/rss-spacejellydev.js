require('dotenv').config();

const { readFeedFromUrl, promiseToConvertXmlToJson } = require('./lib/rss');
const { getRssData } = require('./lib/rss');
const { tweet } = require('./lib/twitter');

const RSS_URL = 'https://www.spacejelly.dev/feed.xml';

(async function run() {
  console.log('=== Begin RSS colbyfayock.com ===');

  console.log(`Current run ${new Date().toUTCString()}`);

  const { lastRun } = await getRssData();

  console.log(`RSS last run ${lastRun}`);

  const feed = await readFeedFromUrl(RSS_URL);
  const json = await promiseToConvertXmlToJson(feed);

  const items = json.rss.channel[0].item;

  console.log(`Found ${items.length} items in feed...`);

  const newItems = items.filter(item => {
    const pubDate = item.pubDate[0];
    return new Date(pubDate) > new Date(lastRun);
  });

  console.log(`Found ${newItems.length} new items in feed...`);

  if ( newItems.length > 0 ) {
    console.log('Posting tweets...');

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

      console.log('<<<')
      console.log(status);
      console.log('>>>')

      try {
        await tweet({
          status
        });
      } catch(e) {
        console.log(`Failed to tweet: ${e.message}`);
      }
    }))
  }

  console.log('=== End RSS colbyfayock.com ===')
})();