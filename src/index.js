const fetch = require('node-fetch');

const defaults = {
    key: 'medium',
    limit: 10
};

module.exports = function (options) {
    options = Object.assign(defaults, options);

    return (files, metalsmith, done) => {
        if (!('username' in options)) {
            done(new Error('A Medium username must be provided.'));
        }

        const metadata = metalsmith.metadata();
        const headers = {
            Accept: 'application/json'
        };

        fetch(`https://medium.com/@${options.username}/latest`, { headers })
            .then(response => response.text())
            .then(body => JSON.parse(body.replace(/^[^{]*/, '')))
            .then(data => {
                metadata[options.key] = {
                    user: data.payload.user,
                    posts: Object.keys(data.payload.references.Post)
                        .slice(0, options.limit)
                        .map(key => data.payload.references.Post[key])
                        .map(post => Object.assign(post, {
                            url: `https://medium.com/@${options.username}/${post.uniqueSlug}`
                        }))
                };

                done();
            })
            .catch(() => {
                done(new Error('Failed to fetch data from the Medium API.'));
            });
    };
};
