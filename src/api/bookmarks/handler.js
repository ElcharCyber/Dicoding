class BookmarksHandler {
  constructor(service) {
    this._service = service;
  }

  async postBookmarkHandler(req, res, next) {
    try {
      const { jobId } = req.params;
      const userId = req.user.id;

      const bookmarkId = await this._service.addBookmark({ userId, jobId });

      return res.status(201).json({
        status: 'success',
        data: {
          id: bookmarkId,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getBookmarksHandler(req, res, next) {
    try {
      const userId = req.user.id;
      const bookmarks = await this._service.getBookmarksByUserId(userId);

      return res.status(200).json({
        status: 'success',
        data: {
          bookmarks,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getBookmarkByIdHandler(req, res, next) {
    try {
      const { jobId, id } = req.params;
      const bookmark = await this._service.getBookmarkById(jobId, id);

      return res.status(200).json({
        status: 'success',
        data: bookmark,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteBookmarkHandler(req, res, next) {
    try {
      const { jobId } = req.params;
      const userId = req.user.id;

      await this._service.deleteBookmarkByUserAndJob(userId, jobId);

      return res.status(200).json({
        status: 'success',
        message: 'Bookmark berhasil dihapus',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = BookmarksHandler;
