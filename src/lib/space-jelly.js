const fetch = require('node-fetch');

/**
 * getColbyashMaruEpisodes
 */

async function getColbyashMaruEpisodes () {
  const data = await fetch('https://spacejelly.dev/colbyashi-maru.json');
  
  const { episodes } = await data.json();

  return episodes;
}

module.exports.getColbyashMaruEpisodes = getColbyashMaruEpisodes;