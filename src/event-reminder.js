require('dotenv').config()

const {
  dateIsFuture,
  dateIsPast,
  sortObjectsByDate,
  dateIs,
  getDatetimeTime,
  getDatetimeShortDate
} = require('./lib/datetime');
const { getColbyashMaruEpisodes } = require('./lib/space-jelly');
const { tweet } = require('./lib/twitter');
const { maxLength } = require('./lib/format');

async function run() {
  const episodes = await getColbyashMaruEpisodes();
  const episodesSorted = sortObjectsByDate(episodes);
  const episodesFuture = episodesSorted.filter((episode) => dateIsFuture(episode.date)).reverse();
  const episodesPast = episodesSorted.filter((episode) => dateIsPast(episode.date));

  const last = episodesPast.shift();

  const upcoming = episodesFuture.shift();
  const weekAfter = episodesFuture.shift();
  const twoAfter = episodesFuture.shift();

  const timeToday = new Date().getTime();

  let status, media;

  if ( dateIs(timeToday, 'monday') ) {
    status = `📣 Upcoming Colbyashi Maru

⚡️ ${maxLength(upcoming.title, 100)}
👾 @${upcoming.twitterhandle}
📆 ${getDatetimeShortDate(upcoming.date)} @ ${getDatetimeTime(upcoming.date)} EST

👾 @${weekAfter.twitterhandle}
📆 ${getDatetimeShortDate(weekAfter.date)} @ ${getDatetimeTime(weekAfter.date)} EST

👾 @${twoAfter.twitterhandle}
📆 ${getDatetimeShortDate(twoAfter.date)} @ ${getDatetimeTime(twoAfter.date)} EST

Add to your calendar and watch past episodes below!

https://spacejelly.dev/colbyashi-maru`;

    media = upcoming.socialImage && upcoming.socialImage.sourceUrl;
  }

  if ( dateIs(timeToday, 'tuesday') ) {
    status = `📣 Tomorrow! 📣

👾 @${upcoming.twitterhandle} faces off on Colbyashi Maru

⚡️ ⚡️ ⚡️ ⚡️ ⚡️ 
${upcoming.title}
⚡️ ⚡️ ⚡️ ⚡️ ⚡️ 

📆 ${getDatetimeShortDate(upcoming.date)} @ ${getDatetimeTime(upcoming.date)} EST

🔔 Follow on Twitch to get notified when we go live!

https://www.twitch.tv/colbyfayock`;

    media = upcoming.socialImage && upcoming.socialImage.sourceUrl;
  }

  if ( dateIs(timeToday, 'wednesday') ) {
    status = `💥💥 TODAY! 💥💥

👾 @${upcoming.twitterhandle} faces off on Colbyashi Maru

⚡️ ⚡️ ⚡️ ⚡️ ⚡️
${upcoming.title}
⚡️ ⚡️ ⚡️ ⚡️ ⚡ 

📆 ${getDatetimeShortDate(upcoming.date)} @ ${getDatetimeTime(upcoming.date)} EST

🔔 Follow on Twitch to get notified when we go live!

https://www.twitch.tv/colbyfayock`;

    media = upcoming.socialImage && upcoming.socialImage.sourceUrl;
  }

  if ( dateIs(timeToday, 'thursday') && last.youtube ) {
    status = `Missed yesterday's Colbyashi Maru?

@${last.twitterhandle} faced off against ${last.title}

Catch the replay after the jump!

${last.youtube}`;
  }

  if ( dateIs(timeToday, 'friday') ) {
    status = `📣 Next Week! 📣

👾 @${upcoming.twitterhandle} faces off on Colbyashi Maru

⚡️ ${upcoming.title}

📆 ${getDatetimeShortDate(upcoming.date)} @ ${getDatetimeTime(upcoming.date)} EST

And later...

${weekAfter.title}

📆 ${getDatetimeShortDate(weekAfter.date)} @${weekAfter.twitterhandle}

https://spacejelly.dev/colbyashi-maru`;

    media = upcoming.socialImage && upcoming.socialImage.sourceUrl;
  }

  if ( status ) {
    console.log('Updating status!')
    console.log(status);
    try {
      await tweet({
        status,
        media
      });
    } catch(e) {
      console.log('Error', e)
    }
  } else {
    console.log('No status found for today!');
  }
}

run();