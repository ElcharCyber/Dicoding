const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class ApplicationsService {
  constructor() {
    this._pool = new Pool({
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
      host: process.env.PGHOST,
      port: process.env.PGPORT,
    });
  }

  async addApplication({ userId, jobId, status = 'pending' }) {
    // Verify job exists
    const jobCheck = await this._pool.query({
      text: 'SELECT id FROM jobs WHERE id = $1',
      values: [jobId],
    });
    if (!jobCheck.rows.length) {
      throw new NotFoundError('Job tidak ditemukan');
    }

    // Verify user exists
    const userCheck = await this._pool.query({
      text: 'SELECT id FROM users WHERE id = $1',
      values: [userId],
    });
    if (!userCheck.rows.length) {
      throw new NotFoundError('User tidak ditemukan');
    }

    const id = `application-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO applications(id, user_id, job_id, status) VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, userId, jobId, status || 'pending'],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Lamaran gagal diajukan');
    }

    return result.rows[0].id;
  }

  async getApplications() {
    const result = await this._pool.query(
      'SELECT id, user_id, job_id, status, created_at FROM applications ORDER BY created_at DESC'
    );
    return result.rows;
  }

  async getApplicationById(id) {
    const query = {
      text: 'SELECT id, user_id, job_id, status, created_at FROM applications WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lamaran tidak ditemukan');
    }

    return result.rows[0];
  }

  async getApplicationsByUserId(userId) {
    const query = {
      text: 'SELECT id, user_id, job_id, status, created_at FROM applications WHERE user_id = $1 ORDER BY created_at DESC',
      values: [userId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async getApplicationsByJobId(jobId) {
    const query = {
      text: 'SELECT id, user_id, job_id, status, created_at FROM applications WHERE job_id = $1 ORDER BY created_at DESC',
      values: [jobId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async editApplicationStatusById(id, status) {
    const query = {
      text: 'UPDATE applications SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id',
      values: [status, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui status lamaran. Id tidak ditemukan');
    }
  }

  async deleteApplicationById(id) {
    const query = {
      text: 'DELETE FROM applications WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lamaran gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = ApplicationsService;
