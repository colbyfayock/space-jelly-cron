require('dotenv').config();
const { GraphQLClient, gql } = require('graphql-request');

const client = new GraphQLClient('https://api-stars.github.com/', {
  headers: {
    authorization: `Bearer ${process.env.GH_STARS_API_TOKEN}`
  }
});

/**
 * addContribution
 */

async function addContribution({ type, title, description, url, date }) {
  const query = gql`
    mutation AddContribution(
      $type: ContributionType!
      $date: GraphQLDateTime!
      $title: String!
      $url: URL
      $description: String!
    ) {
      createContribution(
        data: { date: $date, url: $url, type: $type, title: $title, description: $description }
      ) {
        id
        title
      }
    }
  `;

  const results = await client.request(query, {
    type,
    title,
    description,
    url,
    date: new Date(date).toISOString()
  });

  return results;
}

module.exports.addContribution = addContribution;