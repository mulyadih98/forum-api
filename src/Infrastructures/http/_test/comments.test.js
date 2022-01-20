const pool = require('../../database/postgres/pool');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
describe('/threads/{threadid}/comments endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadid}/comments', () => {
    it('should response 404 if thread of comment not found', async () => {
      // Arrange
      const requestPayload = {
        content: 'test comment',
      };
      const accessToken = await ServerTestHelper.getAccessToken();
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/123/comments',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Thread tidak ditemukan');
    });

    it('should response 400 if payload not content needed property', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({ id: 'test-123' });
      const accessToken = await ServerTestHelper.getAccessToken();
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/test-123/comments',
        payload: {},
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada'
      );
    });

    it('should response 201 and added comment', async () => {
      // Arrange
      const requestPayload = {
        content: 'test comment',
      };
      await ThreadsTableTestHelper.addThread({ id: 'test-123' });
      const accessToken = await ServerTestHelper.getAccessToken();
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/test-123/comments',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
      expect(responseJson.data.addedComment.content).toEqual(
        requestPayload.content
      );
    });
  });

  describe('when DELETE /threads/{threadId/comments}', () => {
    it('should response 404 if thread of comment not found', async () => {
      // Arrange
      const requestPayload = {
        content: 'test comment',
      };
      const accessToken = await ServerTestHelper.getAccessToken();
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/123/comments',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Thread tidak ditemukan');
    });

    describe('verifyCommentOwner', () => {
      it('should response 404 if comment not found', async () => {
        // Arrange
        await ThreadsTableTestHelper.addThread({ id: 'test-123' });
        const accessToken = await ServerTestHelper.getAccessToken();
        const server = await createServer(container);
        // Action
        const response = await server.inject({
          method: 'DELETE',
          url: '/threads/test-123/comments/1',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        // Assert
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toEqual(404);
        expect(responseJson.status).toEqual('fail');
        expect(responseJson.message).toEqual('Comment tidak ditemukan');
      });

      it('should response 403 if comment not found', async () => {
        // Arrange
        await ThreadsTableTestHelper.addThread({ id: 'test-123' });
        const accessToken = await ServerTestHelper.getAccessToken();
        await CommentsTableTestHelper.addComment({
          id: 'test-comment-123',
          owner: 'user-test-authorization',
        });
        const server = await createServer(container);

        // Action
        const response = await server.inject({
          method: 'DELETE',
          url: '/threads/test-123/comments/test-comment-123',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        // Assert
        const responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toEqual(403);
        expect(responseJson.status).toEqual('fail');
        expect(responseJson.message).toEqual(
          'Anda tidak berhak mengakses comment ini'
        );
      });

      it('should response return 200 soft delete comment', async () => {
        // Arrange
        await ThreadsTableTestHelper.addThread({ id: 'thread-test-123' });
        const accessToken = await ServerTestHelper.getAccessToken();
        const { id, thread_id: thread } =
          await CommentsTableTestHelper.addComment({
            id: 'comment-test-123',
            owner: 'user-123',
            thread_id: 'thread-test-123',
          });
        const server = await createServer(container);
        // Action
        const response = await server.inject({
          method: 'DELETE',
          url: `/threads/${thread}/comments/${id}`,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        // Assert
        responseJson = JSON.parse(response.payload);
        expect(response.statusCode).toEqual(200);
        expect(responseJson.status).toEqual('success');
      });
    });

    describe('when GET /threads/{threadId}', () => {
      it('should response return 200 and correct property', async () => {
        // Arrange
        const threadId = 'test-thread-id';
        await UsersTableTestHelper.addUser({ id: 'test-user' });
        await ThreadsTableTestHelper.addThread({
          id: threadId,
          owner: 'test-user',
        });
        await CommentsTableTestHelper.addComment({
          thread_id: threadId,
          owner: 'test-user',
          content: 'test comment',
        });

        const server = await createServer(container);
        // Action
        const response = await server.inject({
          method: 'GET',
          url: `/threads/${threadId}`,
        });

        const responseJson = JSON.parse(response.payload);
        const responseComment = responseJson.data.thread.comments;
        expect(response.statusCode).toEqual(200);
        expect(responseJson.status).toEqual('success');
        expect(responseComment).toHaveLength(1);
      });
    });
  });
});
