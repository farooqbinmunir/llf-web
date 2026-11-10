const MEDIA_FIELDS = ['url', 'alternativeText', 'width', 'height'];

// What every block's heading and settings need.
const HEADING_QUERY = { populate: { links: true, media: { fields: MEDIA_FIELDS } } };
const SETTINGS_QUERY = { populate: { backgroundImage: { fields: MEDIA_FIELDS } } };

export const CONTENT_BOX_QUERY = { populate: { heading: HEADING_QUERY, settings: SETTINGS_QUERY } };
