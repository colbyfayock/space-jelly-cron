require('dotenv').config()

const {
  dateIsFuture,
  dateIsPast,
  sortObjectsByDate,
  dateToLocalTime,
  dateIs,
  getDatetimeTime,
  getDatetimeMeridiem,
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
  const upcomingDate = dateToLocalTime(upcoming.date);

  const weekAfter = episodesFuture.shift();
  const weekAfterDate = dateToLocalTime(weekAfter.date);

  const twoAfter = episodesFuture.shift();
  const twoAfterDate = dateToLocalTime(twoAfter.date);

  const currentDatetimeEst = dateToLocalTime(new Date());

  let status, media;

  if ( dateIs(currentDatetimeEst, 'monday') ) {
    status = `📣 Upcoming Colbyashi Maru

⚡️ ${maxLength(upcoming.title, 100)}
👾 @${upcoming.twitterhandle}
📆 ${getDatetimeShortDate(upcomingDate)} @ ${getDatetimeTime(upcomingDate)}${getDatetimeMeridiem(upcomingDate)} EST

👾 @${weekAfter.twitterhandle}
📆 ${getDatetimeShortDate(weekAfterDate)} @ ${getDatetimeTime(weekAfterDate)}${getDatetimeMeridiem(weekAfterDate)} EST

👾 @${twoAfter.twitterhandle}
📆 ${getDatetimeShortDate(twoAfterDate)} @ ${getDatetimeTime(twoAfterDate)}${getDatetimeMeridiem(twoAfterDate)} EST

Add to your calendar and watch past episodes below!

https://spacejelly.dev/colbyashi-maru`;

    media = upcoming.socialImage && upcoming.socialImage.sourceUrl;
  }

  if ( dateIs(currentDatetimeEst, 'tuesday') ) {
    status = `📣 Tomorrow! 📣

👾 @${upcoming.twitterhandle} faces off on Colbyashi Maru

⚡️ ⚡️ ⚡️ ⚡️ ⚡️ 
${upcoming.title}
⚡️ ⚡️ ⚡️ ⚡️ ⚡️ 

📆 ${getDatetimeShortDate(upcomingDate)} @ ${getDatetimeTime(upcomingDate)}${getDatetimeMeridiem(upcomingDate)} EST

🔔 Follow on Twitch to get notified when we go live!

https://www.twitch.tv/colbyfayock`;

    media = upcoming.socialImage && upcoming.socialImage.sourceUrl;
  }

  if ( dateIs(currentDatetimeEst, 'wednesday') ) {
    status = `💥💥 TODAY! 💥💥

👾 @${upcoming.twitterhandle} faces off on Colbyashi Maru

⚡️ ⚡️ ⚡️ ⚡️ ⚡️
${upcoming.title}
⚡️ ⚡️ ⚡️ ⚡️ ⚡ 

📆 ${getDatetimeShortDate(upcomingDate)} @ ${getDatetimeTime(upcomingDate)}${getDatetimeMeridiem(upcomingDate)} EST

🔔 Follow on Twitch to get notified when we go live!

https://www.twitch.tv/colbyfayock`;

    media = upcoming.socialImage && upcoming.socialImage.sourceUrl;
  }

  if ( dateIs(currentDatetimeEst, 'thursday') && last.youtube ) {
    status = `Missed yesterday's Colbyashi Maru?

@${last.twitterhandle} faced off against ${last.title}

Catch the replay after the jump!

${last.youtube}`;
  }

  if ( dateIs(currentDatetimeEst, 'friday') ) {
    status = `📣 Next Week! 📣

👾 @${upcoming.twitterhandle} faces off on Colbyashi Maru

⚡️ ${upcoming.title}

📆 ${getDatetimeShortDate(upcomingDate)} @ ${getDatetimeTime(upcomingDate)}${getDatetimeMeridiem(upcomingDate)} EST

And later...

${weekAfter.title}

📆 ${getDatetimeShortDate(weekAfterDate)} @${weekAfter.twitterhandle}

https://spacejelly.dev/colbyashi-maru`;

    media = upcoming.socialImage && upcoming.socialImage.sourceUrl;
  }

  if ( status ) {
    try {
      await tweet({
        status,
        media
      });
    } catch(e) {
      console.log('Error', e)
    }
  }
}

run();