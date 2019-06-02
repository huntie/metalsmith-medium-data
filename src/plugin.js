import fetch from 'node-fetch';

const DEFAULT_OPTIONS = {
  key: 'medium',
  limit: 10
};

/**
 * Create the transformed metadata object from the Medium response data and the
 * configured plugin options.
 *
 * @param {Object} data
 * @param {Object} options
 *
 * @return {Object}
 */
const createMetadataObject = ({ payload }, { username, limit }) => ({
  user: payload.user,
  posts: Object.keys(payload.references.Post)
    .slice(0, limit)
    .map(key => payload.references.Post[key])
    .map(post => ({
      ...post,
      url: `https://medium.com/@${username}/${post.uniqueSlug}`
    }))
});

export default function plugin(userOptions) {
  const options = { ...DEFAULT_OPTIONS, ...userOptions };

  return async (files, metalsmith, done) => {
    if (!options.username) {
      done(new Error('A Medium username must be provided.'));

      return;
    }

    try {
      const response = await fetch(`https://medium.com/@${options.username}/latest`, {
        headers: { Accept: 'application/json' }
      });
      const data = JSON.parse((await response.text()).replace(/^[^{]*/, ''));

      Object.assign(metalsmith.metadata(), {
        [options.key]: createMetadataObject(data, options)
      });
    } catch (e) {
      done(new Error('Failed to fetch data from the Medium API.'));

      return;
    }

    done();
  };
}
