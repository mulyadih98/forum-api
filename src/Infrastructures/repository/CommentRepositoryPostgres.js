const AddedComment = require('../../Domains/comment/entities/AddedComment');
const CommentRepository = require('../../Domains/comment/CommentRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(comment) {
    const { content, owner, thread_id } = comment;
    const id = `comment-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO comments VALUES($1,$2,$3,$4,$5) RETURNING id, content, owner',
      values: [id, content, thread_id, date, owner],
    };

    const result = await this._pool.query(query);
    return new AddedComment({ ...result.rows[0] });
  }

  async verifyCommentOwner(commentOwner) {
    const { id, owner } = commentOwner;
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Comment tidak ditemukan');
    }

    const comment = result.rows[0];
    if (comment.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses comment ini');
    }
    return;
  }

  async deleteComment(id) {
    const query = {
      text: "UPDATE comments SET is_deleted = true,content= '**komentar telah dihapus**' WHERE id = $1 RETURNING is_deleted",
      values: [id],
    };
    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async getCommentsByThread(thread) {
    const query = {
      text: `SELECT comments.id as id, comments.date, comments.content, users.username FROM "comments" JOIN "users" ON "comments"."owner" = "users"."id" and "comments"."thread_id" = $1`,
      // text: 'SELECT * from comments where thread_id = $1',
      values: [thread],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = CommentRepositoryPostgres;
