const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comment/CommentRepository');
const GetThreadUseCase = require('../GetThreadUseCase');
const GetThread = require('../../../Domains/threads/entities/GetThread');
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
    expect(actualGetThread).toEqual(expectedThread);
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThread).toHaveBeenCalledWith(
      threadId
    );
  });
});
