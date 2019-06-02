import { take } from 'lodash';
import fetch from 'node-fetch';
import { getPosts } from './selectors';

export const DEFAULT_OPTIONS = {
  key: 'medium',
  limit: 10
};

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
      const { payload } = JSON.parse((await response.text()).replace(/^[^{]*/, ''));

      Object.assign(metalsmith.metadata(), {
        [options.key]: {
          user: payload.user,
          posts: take(getPosts(payload), options.limit)
        }
      });
    } catch (e) {
      done(new Error('Failed to fetch data from the Medium API.'));

      return;
    }

    done();
  };
}
