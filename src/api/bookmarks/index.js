const BookmarksHandler = require('./handler');
const { jobBookmarkRoutes, bookmarksRoutes } = require('./routes');

module.exports = {
  name: 'bookmarks',
  version: '1.0.0',
  register: (app, { service }) => {
    const bookmarksHandler = new BookmarksHandler(service);
    app.use('/jobs/:jobId/bookmark', jobBookmarkRoutes(bookmarksHandler));
    app.use('/bookmarks', bookmarksRoutes(bookmarksHandler));
  },
};
