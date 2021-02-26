require('dotenv').config()

const { dateIsFuture, sortObjectsByDate, dateToLocalTime, dateIs } = require('./lib/datetime');
const { getColbyashMaruEpisodes } = require('./lib/space-jelly');
const { tweet } = require('./lib/twitter');

async function run() {
  const episodes = await getColbyashMaruEpisodes();
  const episodesSorted = sortObjectsByDate(episodes);
  const episodesFuture = episodesSorted.filter((episode) => dateIsFuture(episode.date)).reverse();

  const datetimeEst = dateToLocalTime(new Date());

  if ( dateIs(datetimeEst, 'monday') ) {
    // This Week
  }

  if ( dateIs(datetimeEst, 'thursday') ) {
    // ICYMI
  }

  if ( dateIs(datetimeEst, 'friday') ) {
    const nextWeek = episodesFuture.shift();
    const nextWeekDate = new Date(nextWeek.date);
    const nextWeekTimeString = nextWeekDate.toLocaleTimeString('en-us')
    const nextWeekTime = nextWeekTimeString.split(':').splice(0,2).join(':')
    const nextWeekAmPm = nextWeekTimeString.split(' ').slice(-1)[0].toLowerCase();

    const weekAfter = episodesFuture.shift();
    const weekAfterDate = new Date(weekAfter.date);

    const status = `📣 Next Week! 📣

👾 @${nextWeek.twitterhandle} faces off on Colbyashi Maru

⚡️ ${nextWeek.title}

📆 ${nextWeekDate.toLocaleDateString().split('/').splice(0,2).join('/')} @ ${nextWeekTime}${nextWeekAmPm} EST

And later...

${weekAfter.title}

📆 ${weekAfterDate.toLocaleDateString().split('/').splice(0,2).join('/')} @${weekAfter.twitterhandle}

https://spacejelly.dev/colbyashi-maru`;

    try {
      await tweet({
        status,
        media: nextWeek.socialImage && nextWeek.socialImage.sourceUrl
      });
    } catch(e) {
      console.log('Error', e)
    }
  }
}

run();