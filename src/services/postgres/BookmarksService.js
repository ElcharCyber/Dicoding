const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class BookmarksService {
  constructor() {
    this._pool = new Pool({
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
      host: process.env.PGHOST,
      port: process.env.PGPORT,
    });
  }

  async addBookmark({ userId, jobId }) {
    // Verify job exists
    const jobCheck = await this._pool.query({
      text: 'SELECT id FROM jobs WHERE id = $1',
      values: [jobId],
    });
    if (!jobCheck.rows.length) {
      throw new NotFoundError('Job tidak ditemukan');
    }

    const id = `bookmark-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO bookmarks(id, user_id, job_id) VALUES($1, $2, $3) RETURNING id',
      values: [id, userId, jobId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Bookmark gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getBookmarksByUserId(userId) {
    const query = {
      text: 'SELECT id, user_id, job_id, created_at FROM bookmarks WHERE user_id = $1 ORDER BY created_at DESC',
      values: [userId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async getBookmarkById(jobId, id) {
    const query = {
      text: 'SELECT id, user_id, job_id, created_at FROM bookmarks WHERE id = $1 AND job_id = $2',
      values: [id, jobId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Bookmark tidak ditemukan');
    }

    return result.rows[0];
  }

  async deleteBookmarkByUserAndJob(userId, jobId) {
    const query = {
      text: 'DELETE FROM bookmarks WHERE user_id = $1 AND job_id = $2 RETURNING id',
      values: [userId, jobId],
    };

    await this._pool.query(query);
  }
}

module.exports = BookmarksService;
