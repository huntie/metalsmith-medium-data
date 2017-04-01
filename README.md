# Metalsmith Medium data

Metalsmith plugin to fetch latest user post data from [medium.com](https://medium.com/) as metadata for template usage.

## Installation

    $ npm install metalsmith-medium-data

## Usage

Add an `metalsmith-medium-data` entry in `metalsmith.json` or pass the plugin to `metalsmith.use()` in a JavaScript file.

**metalsmith.json**

```json
{
    "plugins": {
        "metalsmith-medium-data": {
            "username": "huntie"
        }
    }
}
```

**JavaScript file**

```js
import medium from 'metalsmith-medium-data';

metalsmith.use(medium({
    username: 'huntie'
});
```

The plugin will add a new metadata object on build under the key `medium` for use in templates.

| Property | Type | Description |
| --- | --- | --- |
| `medium.user` | `Object` | The user profile data. |
| `medium.posts` | `Array` | The collection of most recent user posts. |

## Options

| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `username` | `String`  | Yes | `null` | The Medium account user from which to fetch posts. |
| `key` | `String` | No | `"medium"` | The name of the key to set in metadata. |
| `limit` | `Number` | No | `10` | The maximum number of `posts` to include. |

## Contributing

If you discover a problem or have a feature request, please [create an issue](https://github.com/huntie/metalsmith-medium-data/issues) or feel free to fork this repository and make improvements.
