import fetch from 'node-fetch';
import plugin, { DEFAULT_OPTIONS } from '../plugin';

jest.mock('node-fetch');

const testOptions = { username: 'huntie' };

describe('plugin', () => {
  let metadata;
  let metalsmith;

  beforeEach(() => {
    fetch.mockImplementation(() =>
      Promise.resolve({
        text: jest.fn(() =>
          Promise.resolve(
            // Reconstruct API response body received including unwanted prefix
            '])}while(1);</x>' +
              JSON.stringify(require('./sample-response.json'))
          )
        )
      })
    );

    metadata = {};
    metalsmith = {
      metadata: jest.fn(() => metadata)
    };
  });

  test('should call done() when run', async () => {
    const done = jest.fn();

    await plugin(testOptions)({}, metalsmith, done);

    expect(done).toHaveBeenCalledTimes(1);
  });

  test('should call done() with error if username option not set', async () => {
    const done = jest.fn();

    await plugin({})({}, metalsmith, done);

    expect(done.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          [Error: A Medium username must be provided.],
        ],
      ]
    `);
  });

  test('should call done() with error on network error', async () => {
    const done = jest.fn();
    fetch.mockImplementation(() => Promise.reject());

    await plugin(testOptions)({}, metalsmith, done);

    expect(done.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          [Error: Failed to fetch data from the Medium API.],
        ],
      ]
    `);
  });

  test('should assign mapped response object to key on metadata', async () => {
    await plugin(testOptions)({}, metalsmith, () => {});

    expect(metadata).toMatchSnapshot();
  });

  test('should assign to specified key on metadata if option set', async () => {
    await plugin({ ...testOptions, key: 'cms' })({}, metalsmith, () => {});

    expect(Object.keys(metadata)).toMatchInlineSnapshot(`
      Array [
        "cms",
      ]
    `);
  });

  test('should limit post entries to number set by limit option', async () => {
    await plugin({ ...testOptions, limit: 2 })({}, metalsmith, () => {});

    expect(metadata[DEFAULT_OPTIONS.key].posts).toHaveLength(2);
  });
});
