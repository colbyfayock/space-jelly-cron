const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');
const Twitter = require('twitter-lite');

let client = {};

/**
 * getTwitterClient
 */

function getTwitterClient(subdomain = 'api') {
  if ( !client[subdomain] ) {
    client[subdomain] = new Twitter({
      subdomain,
      consumer_key: process.env.SPACE_JELLY_TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.SPACE_JELLY_TWITTER_CONSUMER_SECRET,
      access_token_key: process.env.SPACE_JELLY_TWITTER_ACCESS_TOKEN_KEY,
      access_token_secret: process.env.SPACE_JELLY_TWITTER_ACCESS_TOKEN_SECRET
    });
  }

  return client[subdomain];
}

module.exports.getTwitterClient = getTwitterClient;


/**
 * tweet
 * @description Manage setting up and tweeting the given status
 */

async function tweet({ status, media }) {
  const options = {
    status,
  }

  let uploadedMedia;
  let request;

  if ( typeof media === 'string' && media.length !== 0 ) {
    uploadedMedia = await uploadTwitterMedia(media);
  }

  if ( uploadedMedia ) {
    options.media_ids = uploadedMedia.media_id_string;
  }

  request = await updateTwitterStatus(options);
}

module.exports.tweet = tweet;


/**
 * uploadTwitterMedia
 * @description Upload given media to Twitter and return as base64
 */

async function uploadTwitterMedia(media) {
  const errorBase = 'Failed to upload media to Twitter';

  const twitter = getTwitterClient('upload');
  const request = await fetch(media);
  const buffer = await request.buffer();
  const mediaBase64 = Buffer.from(buffer).toString('base64');

  const options = {
    media_data: mediaBase64,
  };

  let response;

  try {
    response = await twitter.post('media/upload', options);
  } catch(e) {
    throw new Error(`${errorBase}: ${e.message}`);
  }

  return response;
}

module.exports.uploadTwitterMedia = uploadTwitterMedia;


/**
 * updateTwitterStatus
 * @description Posts the given status update to twitter
 */

async function updateTwitterStatus(options = {}) {
  const errorBase = 'Failed to update Twitter status';

  const twitter = getTwitterClient();

  let response;

  try {
    response = await twitter.post('statuses/update', options);
  } catch(e) {
    throw new Error(`${errorBase}: ${e.message}`);
  }

  return response;
}

module.exports.updateTwitterStatus = updateTwitterStatus;