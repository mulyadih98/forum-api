const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  })

  afterAll( async () => {
    await pool.end();
  })

  describe('addThread function', () => {
    it('should persist add thread and return added thread correctly', async () => {
      // Arrange 
      const addThread = new AddThread({
        title: 'usecase title',
        body: 'usecase body',
        owner: 'user-123'
      });

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool,fakeIdGenerator);

      // Action 
      await threadRepositoryPostgres.addThread(addThread);
      // Assert 
      const thread = await ThreadsTableTestHelper.findThreadsById('thread-123');
      expect(thread).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      // Arrange
      const addThread = new AddThread({
        title: 'usecase title',
        body: 'usecase body',
        owner: 'user-123'
      });
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool,fakeIdGenerator);

      // Action 
      const addedThread = await threadRepositoryPostgres.addThread(addThread);

      // Assert
      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: 'usecase title',
        owner: 'user-123'
      }));
    })
  })
})