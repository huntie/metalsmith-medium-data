import fetch from 'node-fetch';

export default function plugin({ username, key = 'medium', limit = 10 }) {
  return async (files, metalsmith, done) => {
    if (!username) {
      done(new Error('A Medium username must be provided.'));
    }

    const metadata = metalsmith.metadata();

    try {
      const response = await fetch(
        `https://medium.com/@${username}/latest`,
        { headers: { Accept: 'application/json' } }
      );
      const { payload } = JSON.parse(
        (await response.text()).replace(/^[^{]*/, '')
      );

      metadata[key] = {
        user: payload.user,
        posts: Object.keys(payload.references.Post)
          .slice(0, limit)
          .map(key => payload.references.Post[key])
          .map(post =>
            Object.assign(post, {
              url: `https://medium.com/@${username}/${post.uniqueSlug}`
            })
          )
      };
    } catch (e) {
      done(new Error('Failed to fetch data from the Medium API.'));
    }

    done();
  };
}
