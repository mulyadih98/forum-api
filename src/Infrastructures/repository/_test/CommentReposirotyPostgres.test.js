const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddComment = require('../../../Domains/comment/entities/AddComment');
const AddedComment = require('../../../Domains/comment/entities/AddedComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
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
      await UsersTableTestHelper.addUser({ id: 'user-persist' });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-persist',
        owner: 'user-persist',
      });
      const addComment = new AddComment({
        content: 'test repository content comment',
        thread_id: 'thread-persist',
        owner: 'user-persist',
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
      await UsersTableTestHelper.addUser({
        id: 'user-correctly',
        username: 'correct-user',
      });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-correct',
        owner: 'user-correctly',
      });
      const addComment = new AddComment({
        content: 'test repository content comment',
        thread_id: 'thread-correct',
        owner: 'user-correctly',
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
          owner: 'user-correctly',
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
      await UsersTableTestHelper.addUser({ id: 'owner-test' });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-test',
        owner: 'owner-test',
      });
      const payload = {
        owner: 'owner-test',
        thread_id: 'thread-test',
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
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({ owner: 'user-123' });
      const id = 'coment-123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await CommentsTableTestHelper.addComment({ id, thread_id: 'thread-123' });
      // Action
      await commentRepositoryPostgres.deleteComment(id);
      // Assert
      const comment = await CommentsTableTestHelper.findCommentById(id);
      expect(comment[0]['is_deleted']).toEqual(true);
    });
  });

  describe('getCommentsByThread', () => {
    it('should return is_deleted true if comments was deleted', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      const thread_id = await ThreadsTableTestHelper.addThread({
        owner: 'user-123',
      });
      await CommentsTableTestHelper.addComment({
        thread_id,
      });
      const comment2 = await CommentsTableTestHelper.addComment({
        id: 'test-234',
        thread_id,
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      // Action
      await commentRepositoryPostgres.deleteComment(comment2.id);
      const result = await commentRepositoryPostgres.getCommentsByThread(
        'thread-123'
      );
      // Assert
      expect(result[0].thread_id).toEqual(thread_id);
      expect(result[1].thread_id).toEqual(thread_id);
      expect(result[0].is_deleted).toEqual(false);
      expect(result[1].is_deleted).toEqual(true);
      expect(result).toHaveLength(2);
    });
  });
});
