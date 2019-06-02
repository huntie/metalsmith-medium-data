import { last } from 'lodash';
import snapshotDiff from 'snapshot-diff';
import { getPosts } from '../selectors';

describe('selectors', () => {
  describe('getPosts', () => {
    test('should select a transformed subset of post data', () => {
      const { payload } = require('./sample-response.json');

      expect(
        snapshotDiff(
          last(Object.values(payload.references.Post)),
          last(getPosts(payload))
        )
      ).toMatchSnapshot();
    });
  });
});
