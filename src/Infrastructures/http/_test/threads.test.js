const pool = require('../../database/postgres/pool');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  })

  describe('when POST /threads', () => {
    it('should response 201 and added thread', async () => {
      // Arrange
      const payload = {
        title: 'title',
        body: 'dummy body',
      };
      const accessToken = await ServerTestHelper.getAccessToken();
      const server = await createServer(container);
      // Action
      const response = await server.inject({
        url: '/threads',
        method: 'POST',
        payload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log(response)
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
      expect(responseJson.data.addedThread.title).toEqual(payload.title);
    });
  })
})