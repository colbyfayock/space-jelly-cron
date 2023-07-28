require('dotenv').config();

const { readFeedFromUrl, promiseToConvertXmlToJson } = require('./lib/rss');
const { addContribution } = require('./lib/github');
const { getJsonByPath, updateJsonByPath } = require('./lib/filesystem');

/**
 * TYPES
 * - OTHER
 * - FORUM
 * - SPEAKING
 * - BLOGPOST
 * - HACKATHON
 * - VIDEO_PODCAST
 * - ARTICLE_PUBLICATION
 * - EVENT_ORGANIZATION
 * - OPEN_SOURCE_PROJECT
 */

const FEEDS = [
  {
    title: "spacejelly.dev",
    url: 'https://www.spacejelly.dev/feed.xml',
    type: 'BLOGPOST',
    description: "Tutorial for spacejelly.dev",
    itemsExtractor: (feed) => feed.rss.channel[0].item,
    transformer: (item) => {
      return {
        title: item.title[0],
        url: item.link[0],
        date: new Date(item.pubDate[0]).toISOString()
      }
    }
  },
  {
    title: "youtube.com/colbyfayock",
    url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC7Wpv0Aft4NPNhHWW_JC4GQ',
    type: 'VIDEO_PODCAST',
    description: "Video tutorial on youtube.com/colbyfayock",
    itemsExtractor: (feed) => feed.feed.entry,
    transformer: (item) => {
      return {
        title: item.title[0],
        url: item.link[0]['$'].href,
        date: new Date(item.published[0]).toISOString()
      }
    }
  },
];

(async function run() {

  const { lastRun } = await getJsonByPath('./data/github-contributions.json');
  const currentRun = new Date();

  await Promise.all(FEEDS.map(async ({ title, url, itemsExtractor, transformer, type, description }) => {
    console.log(`=== Begin feed ${title} ===`);

    console.log(`Last run ${lastRun}`);
    console.log(`Current run ${currentRun.toUTCString()}`);

    const feed = await readFeedFromUrl(url);
    const json = await promiseToConvertXmlToJson(feed);

    const items = itemsExtractor(json).map(item => {
      return {
        type,
        description,
        ...transformer(item),
      }
    });

    console.log(`Found ${items.length} items in feed...`);

    const newItems = items.filter(({ date }) => new Date(date) > new Date(lastRun));

    console.log(`Found ${newItems.length} new items in feed...`);

    for ( let i = 0, len = newItems.length; i < len; i++) {

      console.log(`Adding: ${JSON.stringify(newItems[i], null, 2)}`);

      try {
        await addContribution(newItems[i]);
      } catch(e) {
        console.log(`Failed to add item: ${e.message}`);
      }
      await new Promise((resolve, reject) => setTimeout(() => resolve(), 1000))
    }

    console.log(`=== End feed ${title} ===`);
  }));

  await updateJsonByPath({ lastRun: currentRun.toUTCString() }, './data/github-contributions.json');
})();