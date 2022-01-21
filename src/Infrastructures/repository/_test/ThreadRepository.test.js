const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist add thread and return added thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'thread-test-123',
        username: 'testthread',
      });
      const addThread = new AddThread({
        title: 'usecase title',
        body: 'usecase body',
        owner: 'thread-test-123',
      });

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await threadRepositoryPostgres.addThread(addThread);
      // Assert
      const thread = await ThreadsTableTestHelper.findThreadsById('thread-123');
      expect(thread).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'thread-test-123',
        username: 'testtread',
      });
      const addThread = new AddThread({
        title: 'usecase title',
        body: 'usecase body',
        owner: 'thread-test-123',
      });
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(addThread);

      // Assert
      expect(addedThread).toStrictEqual(
        new AddedThread({
          id: 'thread-123',
          title: 'usecase title',
          owner: 'thread-test-123',
        })
      );
    });
  });

  describe('getThreadById', () => {
    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'testthread' });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      // Action & Assert
      await expect(
        threadRepositoryPostgres.getThreadById('thread-123')
      ).rejects.toThrowError(NotFoundError);
    });

    it('should return thread object correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'testthread' });
      await ThreadsTableTestHelper.addThread({
        id: 'emul-123',
        owner: 'user-123',
      });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      // Action
      const threadObj = await threadRepositoryPostgres.getThreadById(
        'emul-123'
      );
      // Assert
      expect(threadObj.id).toEqual('emul-123');
      expect(threadObj.username).toEqual('testthread');
    });
  });
});
