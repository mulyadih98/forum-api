const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comment/CommentRepository');
const GetThreadUseCase = require('../GetThreadUseCase');
const GetThread = require('../../../Domains/threads/entities/GetThread');
const GetComment = require('../../../Domains/comment/entities/GetComment');
describe('GetThreadUseCase', () => {
  it('should orchestrating the get thread action correctly', async () => {
    // arrange
    const threadId = 'thread-123';
    const expectedThread = new GetThread({
      id: 'usecase-thread-123',
      title: 'usecase title',
      body: 'usecase body',
      date: 'usecase date',
      username: 'usecase-user',
      comments: [],
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    // mocking
    mockThreadRepository.getThreadById = jest.fn().mockImplementation(() =>
      Promise.resolve({
        id: 'usecase-thread-123',
        title: 'usecase title',
        body: 'usecase body',
        date: 'usecase date',
        username: 'usecase-user',
      })
    );
    mockCommentRepository.getCommentsByThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve([]));

    // create use case instance
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });
    // Action
    const actualGetThread = await getThreadUseCase.execute(threadId);

    // Assert
    expect(actualGetThread).toEqual(expectedThread);
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThread).toHaveBeenCalledWith(
      threadId
    );
  });

  it('should return **komentar telah dihapus** whent comments is_deleted true', async () => {
    // Arrange
    const expectedThread = new GetThread({
      id: 'usecase-thread-123',
      title: 'usecase title',
      body: 'usecase body',
      date: 'usecase date',
      username: 'usecase-user',
      comments: [
        new GetComment({
          id: 'comment-123',
          username: 'johndoe',
          date: '2021-08-08T07:22:33.555Z',
          content: 'sebuah comment',
          is_deleted: false,
        }),
        new GetComment({
          id: 'comment-234',
          username: 'alex',
          date: '2021-08-08T07:22:33.555Z',
          content: '**komentar telah dihapus**',
          is_deleted: true,
        }),
      ],
    });
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    // mocking
    mockThreadRepository.getThreadById = jest.fn().mockImplementation(() =>
      Promise.resolve({
        id: 'usecase-thread-123',
        title: 'usecase title',
        body: 'usecase body',
        date: 'usecase date',
        username: 'usecase-user',
      })
    );
    mockCommentRepository.getCommentsByThread = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve([
          {
            id: 'comment-123',
            username: 'johndoe',
            date: '2021-08-08T07:22:33.555Z',
            content: 'sebuah comment',
            is_deleted: false,
          },
          {
            id: 'comment-234',
            username: 'alex',
            date: '2021-08-08T07:22:33.555Z',
            content: 'sebuah comment',
            is_deleted: true,
          },
        ])
      );

    // Action
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    const actualGetThread = await getThreadUseCase.execute(
      'usecase-thread-123'
    );
    // Assert
    expect(actualGetThread).toEqual(expectedThread);
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(
      'usecase-thread-123'
    );
    expect(mockCommentRepository.getCommentsByThread).toHaveBeenCalledWith(
      'usecase-thread-123'
    );
  });
});
