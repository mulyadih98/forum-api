/** istanbul ignore file */

const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadsTableTestHelper = {
  async addThread({
    id = 'thread-123',
    title = 'test thread title',
    body = 'test thread body ',
    date = new Date().toISOString(),
    owner = 'user-123',
  }) {
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4,$5) RETURNING id',
      values: [id, title, body, date, owner],
    };

    const result = await pool.query(query);
    return result.rows[0].id;
  },
  async findThreadsById(id) {
    const query = {
      text: 'SELECT * FROM threads where id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM threads WHERE 1=1');
  },
};

module.exports = ThreadsTableTestHelper;
