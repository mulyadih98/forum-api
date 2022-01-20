const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddComment = require('../../../Domains/comment/entities/AddComment');
const AddedComment = require('../../../Domains/comment/entities/AddedComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist add comment and return add comment correctly', async () => {
      // Arrange
      const addComment = new AddComment({
        content: 'test repository content comment',
        thread_id: 'thread-123',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await commentRepositoryPostgres.addComment(addComment);
      // Assert
      const comment = await CommentsTableTestHelper.findCommentById(
        'comment-123'
      );
      expect(comment).toHaveLength(1);
    });

    it('should return added comment correctly', async () => {
      // Arrange
      const addComment = new AddComment({
        content: 'test repository content comment',
        thread_id: 'thread-123',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(
        addComment
      );
      // Assert
      expect(addedComment).toStrictEqual(
        new AddedComment({
          id: 'comment-123',
          content: 'test repository content comment',
          owner: 'user-123',
        })
      );
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should throw NotFoundError if comment not available', async () => {
      // Arrange
      const payload = {
        owner: 'owner-test',
        commentId: 'test-coment',
      };
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      // Action and Assert
      await expect(
        commentRepositoryPostgres.verifyCommentOwner(payload)
      ).rejects.toThrowError(NotFoundError);
    });

    it('should throw AuthorizationError if owner not the owner of the comments', async () => {
      // Arrange
      const payload = {
        owner: 'owner-test',
        id: 'test-coment',
      };
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await CommentsTableTestHelper.addComment(payload);
      // Action and Assert
      await expect(
        commentRepositoryPostgres.verifyCommentOwner({
          id: payload.id,
          owner: 'bukan-ouner',
        })
      ).rejects.toThrowError(AuthorizationError);
    });
  });

  describe('deleteComment function', () => {
    it('should be delete from comments', async () => {
      // Arrange
      const id = 'coment-123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await CommentsTableTestHelper.addComment({ id });
      // Action
      await commentRepositoryPostgres.deleteComment(id);
      // Assert
      const comment = await CommentsTableTestHelper.findCommentById(id);
      expect(comment[0]['is_deleted']).toEqual(true);
    });
  });

  describe('getCommentsByThread', () => {
    it('should return content **komentar telah dihapus** if comments was deleted', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      const coment1 = await CommentsTableTestHelper.addComment({
        thread_id: 'test-123',
      });
      const comment2 = await CommentsTableTestHelper.addComment({
        id: 'test-234',
        thread_id: 'test-123',
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      // Action
      const deleteComment = await commentRepositoryPostgres.deleteComment(
        comment2.id
      );
      const result = await commentRepositoryPostgres.getCommentsByThread(
        'test-123'
      );
      // Assert
      expect(result[1].content).toEqual('**komentar telah dihapus**');
    });
  });
});
