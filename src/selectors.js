import { pick } from 'lodash';

/**
 * Select a transformed subset of post data from the given response payload.
 *
 * @param {Object} payload
 *
 * @return {Array}
 */
export const getPosts = payload =>
  Object.values(payload.references.Post)
    .map(post => ({
      ...pick(post, [
        'canonicalUrl',
        'coverless',
        'createdAt',
        'creatorId',
        'detectedLanguage',
        'displayAuthor',
        'firstPublishedAt',
        'inResponseToPostId',
        'inResponseToRemovedAt',
        'isNsfw',
        'isProxyPost',
        'isSeries',
        'latestPublishedAt',
        'latestPublishedVersion',
        'license',
        'slug',
        'title',
        'type',
        'versionId'
      ]),
      subtitle: post.previewContent.subtitle,
      url: `https://medium.com/@${payload.user.username}/${post.uniqueSlug}`,
      ...pick(post.virtuals, [
        'previewImage',
        'readingTime',
        'recommends',
        'responsesCreatedCount',
        'totalClapCount'
      ]),
      tags: post.virtuals.tags.map(tag => pick(tag, ['name', 'slug']))
    }));
